import ResumePreview from "../../../components/ResumePreview";
import { ResumeValues } from "utils/validations";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import cn from "@resume/ui/cn";

interface ResumePreviewSectionProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
    className?: string;
}

export default function ResumePreviewSection({
    resumeData,
    setResumeData,
    className
}: ResumePreviewSectionProps) {
    
    return (
        <div className={cn("group relative hidden w-1/2 md:flex", className)}>
            <div className="flex w-full justify-center overflow-y-auto bg-secondary">
                <ResumePreview resumeData={resumeData} className={"max-w-2xl shadow-md"}/>
            </div>
        </div>
    )
}