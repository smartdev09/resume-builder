'use client'

import { useSearchParams } from "next/navigation"
import { steps } from "./steps"
import Tabs from "./Tabs"
import Footer from "./Footer"
import { useState } from "react"
import { ResumeValues } from "utils/validations"
import ResumePreviewSection from "./ResumePreviewSection"
import cn from "@resume/ui/cn";
import useAutoSaveReume from "./useAutoSaveResume"
import useUnloadWarning from "@resume/ui/hooks/use-unload-warning"
import { ResumeServerData } from "utils/types"
import { mapToResumeValues } from "utils/utils"
import TemplateSelector from "./TemplateSelector"

interface ResumeEditorProps {
    resumeToEdit: ResumeServerData | null;
}

export default function ResumeEditor({ resumeToEdit } : ResumeEditorProps) {
    const searchParams = useSearchParams();
    const [resumeData, setResumeData] = useState<ResumeValues>(
        resumeToEdit ? mapToResumeValues(resumeToEdit) : { selectedTemplate: 'simple' },
    );
    const [showResumePreviewOnSmallScreen, setShowResumePreviewOnSmallScreen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(resumeData.selectedTemplate);

    const { isSaving, hasUnsavedData } = useAutoSaveReume(resumeData);

    useUnloadWarning(hasUnsavedData)

    const currentStep = searchParams.get("step") || steps[0]!.key;

    function setCurrentStep(key: string) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("step", key);
        // router.push makes a request to the server which is slow
        window.history.pushState(null, "", `?${newSearchParams.toString()}`);
    }

    const FormComponent = steps.find((step) => step.key === currentStep)?.component

    return (
        <div className="flex grow flex-col">
            <main className="relative grow w-full">
                <div className="absolute bottom-0 top-0 flex w-full">
                    <div className={cn("w-full p-3 overflow-y-auto space-y-12", showResumePreviewOnSmallScreen && "hidden")}>
                            <Tabs 
                                currentStep={currentStep} 
                                setCurrentStep={setCurrentStep} 
                            />
                        {FormComponent && <FormComponent 
                            resumeData={resumeData}
                            setResumeData={setResumeData}    
                        />}
                    </div>
                    <div className="grow md:border-r" />
                    <ResumePreviewSection 
                        resumeData={resumeData} 
                        setResumeData={setResumeData} 
                        className={cn(showResumePreviewOnSmallScreen && "flex")}
                        selectedTemplate={selectedTemplate}
                    />
                    <TemplateSelector
                        onSelectTemplate={setSelectedTemplate}
                        className="w-[calc(25%-1rem)]"
                        setResumeData={setResumeData}
                        resumeData={resumeData}
                    />
                </div>
            </main>
            <Footer 
                currentStep={currentStep} 
                setCurrentStep={setCurrentStep} 
                showResumePreviewOnSmallScreen={showResumePreviewOnSmallScreen} 
                setShowResumePreviewOnSmallScreen={setShowResumePreviewOnSmallScreen}
                resumeData={resumeData}
                setResumeData={setResumeData}
                isSaving={isSaving}
            />
        </div>
    )
}