import { useEffect, useState, useRef } from "react";
import useDebounce from "@resume/ui/hooks/use-debounce";
import { ResumeValues } from "utils/validations";
import { useSearchParams } from "next/navigation";
import { useToast } from "@resume/ui/hooks/use-toast";
import { saveResume } from "./actions";
import { Button } from "@resume/ui/button";
import { fileReplacer } from "utils/utils";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function useAutoSaveResume(resumeData: ResumeValues) {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const debouncedResumeData = useDebounce(resumeData, 1500);

  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData)
  );
  const [resumeId, setResumeId] = useState(resumeData.id);
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Prevent multiple saves at the same time
  const saveInProgress = useRef(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeData]);

  useEffect(() => {
    async function save() {
      if (saveInProgress.current) return; // block overlapping saves
      saveInProgress.current = true;

      try {
        setIsSaving(true);
        setIsError(false);

        // ✅ Supabase GitHub session check
        const { data: { session }, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          throw new Error("Please login with GitHub to continue");
        }

        const newData = structuredClone(debouncedResumeData);

        // ✅ Better photo comparison
        const isPhotoSame =
          JSON.stringify(lastSavedData.photo, fileReplacer) ===
          JSON.stringify(newData?.photo, fileReplacer);

        if (isPhotoSame) {
          newData.photo = undefined;
        }

        const updatedResume = await saveResume({
          ...newData,
          id: resumeId,
        });
//@ts-ignore
        setResumeId(updatedResume?.id);
        setLastSavedData(structuredClone(debouncedResumeData));
//@ts-ignore
        if (searchParams.get("resumeId") !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          //@ts-ignore
          newSearchParams.set("resumeId", updatedResume.id);
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`
          );
        }
      } catch (error) {
        console.error('errro:',error);
        setIsError(true);

        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss();
                  save();
                }}
              >
                Retry Save
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false);
        saveInProgress.current = false;
      }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save();
    }
  }, [debouncedResumeData, lastSavedData, isError, searchParams, resumeId, toast]);

  return {
    isSaving,
    hasUnsavedData:
      JSON.stringify(resumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer),
  };
}
