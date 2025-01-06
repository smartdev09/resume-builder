import { Button } from "@resume/ui/button";
import Link from "next/link";
import { steps } from "./steps";
import { FileUserIcon, PenLineIcon } from "lucide-react";
import cn from "@resume/ui/cn";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import { ResumeValues } from "utils/validations";

interface FooterProps {
    currentStep: string;
    setCurrentStep: (step: string) => void;
    showResumePreviewOnSmallScreen: boolean;
    setShowResumePreviewOnSmallScreen: (show: boolean) => void;
    resumeData: ResumeValues;
    setResumeData: (resumeData: ResumeValues) => void;
    isSaving: boolean;
}

export default function Footer({
    currentStep, 
    setCurrentStep, 
    showResumePreviewOnSmallScreen, 
    setShowResumePreviewOnSmallScreen,
    resumeData, 
    setResumeData,
    isSaving
} : FooterProps) {

    const previousStep = steps.find((_, index) => steps[index + 1]?.key === currentStep)?.key;
    const nextStep = steps.find((_, index) => steps[index - 1]?.key === currentStep)?.key;

    return (
        <footer className="w-full border-t px-3 py-5">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Button 
                        variant="secondary"
                        onClick={previousStep ? () => setCurrentStep(previousStep) : undefined}
                        disabled={!previousStep}
                    >
                        Previous step
                    </Button>
                    <Button
                        onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
                        disabled={!nextStep}
                    >
                        Next step
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowResumePreviewOnSmallScreen(!showResumePreviewOnSmallScreen)}
                        className="md:hidden"
                        title={
                            showResumePreviewOnSmallScreen ? "Show input form" : "Show resume previews"
                        }
                    >
                        {showResumePreviewOnSmallScreen ? <PenLineIcon /> : <FileUserIcon />}
                    </Button>
                </div>
                <div className="flex items-start gap-3">
                <ColorPicker 
                    color={resumeData.colorHex}
                    onChange={(color => (
                        setResumeData({ ...resumeData, colorHex: color.hex })
                    ))}
                />
                <BorderStyleButton 
                    //@ts-ignore
                    borderStyle={resumeData.borderStyle} 
                    onChange={(borderStyle) => setResumeData({ ...resumeData, borderStyle })}    
                />
                    <Button variant="secondary" asChild>
                        <Link href="/resumes">Close</Link>
                    </Button>
                    <p className={cn("text-muted-foreground opacity-0", isSaving && 'opacity-100')}>Saving...</p>
                </div>
            </div>
        </footer>
    )
}