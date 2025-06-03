// import ResumePreview from "../../../components/ResumePreview";
import { ResumeValues } from "utils/validations";
import BorderStyleButton from "./BorderStyleButton";
import cn from "@resume/ui/cn";
import FloatingATSScore from "./shared/FloatingATSScore";

import Basic from "../templates/Basic";
import Diamond from "../templates/Diamond";
import Vibes from "../templates/Vibes";
import IT from "../templates/IT";
import Faang from "../templates/Faang"
import TwoColumn from "../templates/TwoColumn";
import AtsApproved from "../templates/AtsApproved"

import { JSX } from "react";

interface ResumePreviewSectionProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
    className?: string;
    selectedTemplate: string;
    onATSDetailsClick?: () => void;
}

interface Templates {
    [key: string]: (props: any) => JSX.Element; 
}

export default function ResumePreviewSection({
    resumeData,
    setResumeData,
    className,
    selectedTemplate,
    onATSDetailsClick
}: ResumePreviewSectionProps) {

    const templates: Templates = {
        faang: Faang,
        "two-column": TwoColumn,
        "ats-approved": AtsApproved,
        basic: Basic,
        diamond: Diamond,
        vibes: Vibes,
        it: IT,
    };
    
    const TemplateComponent = templates[selectedTemplate] || Basic;

    return (
        <div className={cn("group relative w-full rounded-md flex flex-col", className)}>
            {/* ATS Score Overlay */}
            {/* <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <FloatingATSScore 
                    resumeData={resumeData}
                    onViewDetails={onATSDetailsClick}
                />
            </div> */}
            
            {/* Resume Template */}
            <div className="flex-1 flex justify-center p-4">
                <TemplateComponent resumeData={resumeData} className="bg-white shadow-md"/>
            </div>
        </div>
    )
}