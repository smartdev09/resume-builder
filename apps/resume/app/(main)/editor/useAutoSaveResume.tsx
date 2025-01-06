import { useEffect, useState } from "react";

import useDebounce from "@resume/ui/hooks/use-debounce";
import { ResumeValues } from "utils/validations";
import { useSearchParams } from "next/navigation";
import { useToast } from "@resume/ui/hooks/use-toast";
import { saveResume } from "./actions";
import { Button } from "@resume/ui/button";
import { fileReplacer } from "utils/utils";

export default function useAutoSaveReume(resumeData: ResumeValues) {
    const searchParams = useSearchParams();

    const { toast } = useToast();

    const debouncedResumeData = useDebounce(resumeData, 1500);
    const [lastSavedData, setLastSavedData] = useState(
        structuredClone(resumeData)
    )
    const [resumeId, setResumeId] = useState(resumeData.id)
    const [isError, setIsError] = useState(false);

   const [isSaving, setIsSaving] = useState(false);

   useEffect(() => {
    setIsError(false);
   }, [debouncedResumeData])
   
   useEffect(() => {
       async function save() {
        try {
           setIsSaving(true);
           setIsError(false);

           const newData = structuredClone(debouncedResumeData);

           const updatedResume = await saveResume({
            ...newData,
            ...(JSON.stringify(lastSavedData.photo, fileReplacer) === JSON.stringify(newData?.photo, fileReplacer) && {
                photo: undefined
            }),
            id: resumeId
           })

           setResumeId(updatedResume.id)
    
           setLastSavedData(structuredClone(debouncedResumeData))
           if(searchParams.get('resumeId') !== updatedResume.id) {
            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.set("resumeId", updatedResume.id);
            window.history.replaceState(
                null, "", `?${newSearchParams.toString()}`
            )
           }
           setIsSaving(false);
     
    } catch (error) {
        setIsError(true);
        console.error(error)
        const { dismiss } = toast({
            variant: 'destructive',
            description: (
                <div className="space-y-3">
                    <p>Could not save changes</p>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            dismiss();
                            save();
                        }}
                    />
                </div>
            ),

        })
    } finally {
        setIsSaving(false)
    }
}

    const hasUnsavedChanges = JSON.stringify(debouncedResumeData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer) 

    if(hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
        save()
    }
    

    }, [debouncedResumeData, isSaving, lastSavedData, isError, searchParams, toast, resumeId])
    
    return {
        isSaving,
        hasUnsavedData: JSON.stringify(resumeData) !== JSON.stringify(lastSavedData)
    }
}