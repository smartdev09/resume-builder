// import ResumePreview from "../../../components/ResumePreview";
import { ResumeValues } from "utils/validations";
import BorderStyleButton from "./BorderStyleButton";
import cn from "@resume/ui/cn";

import Basic from "../templates/Basic";
import Diamond from "../templates/Diamond";
import Vibes from "../templates/Vibes";
import IT from "../templates/IT";
import { JSX } from "react";

interface ResumePreviewSectionProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
    className?: string;
    selectedTemplate: string
}

interface Templates {
    [key: string]: (props: any) => JSX.Element; 
}

export default function ResumePreviewSection({
    resumeData,
    setResumeData,
    className,
    selectedTemplate
}: ResumePreviewSectionProps) {

    const templates: Templates = {
        basic: Basic,
        diamond: Diamond,
        vibes: Vibes,
        it: IT
    };
    
    const TemplateComponent = templates[selectedTemplate] || Basic;

    return (
        <div className={cn("group relative hidden w-full md:flex md:w-1/2", className)}>
            <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
                <TemplateComponent resumeData={resumeData} className={"max-w-2xl bg-white shadow-md"}/>
            </div>
        </div>
    )
}