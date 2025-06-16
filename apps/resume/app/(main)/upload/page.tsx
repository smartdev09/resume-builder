"use client";
import { useState, useEffect } from "react";
import { readPdf } from "utils/lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "utils/lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "utils/lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "utils/lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "utils/lib/parse-resume-from-pdf/extract-resume-from-sections";
import { ResumeDropzone } from "../../components/ResumeDropzone";
import { cx } from "utils/lib/cx";
import Link from "next/link";
import { ResumeTable } from "./ResumeTable";
import { FlexboxSpacer } from "@resume/ui/FlexboxSpacer";
import { mapParsedResumeToReduxFormat } from "utils/utils";
import { setResume } from "utils/lib/redux/resumeSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "utils/lib/redux/hooks";
import { Button } from "@resume/ui/button";

export default function ResumeParser() {
  const [textItems, setTextItems] = useState<TextItems>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleFileChange = async (fileUrl: string) => {
    if (!fileUrl) return;
    
    const textItems = await readPdf(fileUrl);
    setTextItems(textItems);
    
    const lines = groupTextItemsIntoLines(textItems || []);
    const sections = groupLinesIntoSections(lines);
    const resume = extractResumeFromSections(sections);
    
    const resumeForRedux = mapParsedResumeToReduxFormat(resume);
    dispatch(setResume(resumeForRedux));
    router.push("/editor");
  };

  return (
    <main className="h-full w-full overflow-hidden">
      <div className="mt-3">
        <ResumeDropzone
          onFileUrlChange={handleFileChange}
          playgroundView={true}
        />
      </div>
    </main>
  );
}
