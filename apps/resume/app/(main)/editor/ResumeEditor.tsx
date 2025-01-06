'use client'

import { useSearchParams } from "next/navigation"
import { steps } from "./steps"
import Breadcrumbs from "./Breadcrumbs"
import Footer from "./Footer"
import { useState } from "react"
import { ResumeValues } from "utils/validations"
import ResumePreviewSection from "./ResumePreviewSection"
import cn from "@resume/ui/cn";
import useAutoSaveReume from "./useAutoSaveResume"
import useUnloadWarning from "@resume/ui/hooks/use-unload-warning"
import { ResumeServerData } from "utils/types"
import { mapToResumeValues } from "utils/utils"

interface ResumeEditorProps {
    resumeToEdit: ResumeServerData | null;
}

export default function ResumeEditor({ resumeToEdit } : ResumeEditorProps) {
    const searchParams = useSearchParams();

    const [resumeData, setResumeData] = useState<ResumeValues>(
        resumeToEdit ? mapToResumeValues(resumeToEdit) : {},
    );
    const [showResumePreviewOnSmallScreen, setShowResumePreviewOnSmallScreen] = useState(false);

    const { isSaving, hasUnsavedData } = useAutoSaveReume(resumeData);
    console.log(isSaving, hasUnsavedData)

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
            {/* <header className="space-y-1.5 border-b px-3 py-5 text-center">
                <h1 className="text-2xl font-bold">
                    Build your resume
                </h1>
                <p>
                    Follow the steps below to create your resume. Your progress will be saved automatically. 
                </p>
            </header> */}
            <main className="relative grow w-full">
                <div className="absolute bottom-0 top-0 flex w-full">
                    <div className={cn("w-full p-3 overflow-y-auto space-y-12", showResumePreviewOnSmallScreen && "hidden")}>
                        <Breadcrumbs 
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