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
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@resume/ui/resizable";

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
                <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg">
                    {/* Form Component Panel */}
                    <ResizablePanel defaultSize={45} minSize={30} maxSize={60}  className={cn(
                "flex flex-col",
                showResumePreviewOnSmallScreen && "hidden"
              )}>
                          <div className="flex-1 min-h-0">
                <div className="h-full p-3 overflow-y-auto space-y-12 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                  
                  {FormComponent && (
                    <FormComponent
                      resumeData={resumeData}
                      setResumeData={setResumeData}
                    />
                  )}
                </div>
              </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Resume Preview Panel */}
                    <ResizablePanel
              defaultSize={50}
              className={cn(
                "flex flex-col overflow-hidden",
                showResumePreviewOnSmallScreen && "flex"
              )}
            >
              <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                <ResumePreviewSection
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                  selectedTemplate={selectedTemplate}
                />
              </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Template Selector Panel */}
                    <ResizablePanel
              defaultSize={18}
              minSize={10}
              className="flex flex-col overflow-hidden"
            >
              <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                <TemplateSelector
                  onSelectTemplate={setSelectedTemplate}
                  setResumeData={setResumeData}
                  resumeData={resumeData}
                />
              </div>
            </ResizablePanel>
                </ResizablePanelGroup>
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


