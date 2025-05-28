'use client'

import { useSearchParams } from "next/navigation"
import { steps } from "./steps"
import Tabs from "./Tabs"
import Footer from "./Footer"
import { useState, useEffect } from "react"
import { ResumeValues } from "utils/validations"
import ResumePreviewSection from "./ResumePreviewSection"
import cn from "@resume/ui/cn";
import useAutoSaveReume from "./useAutoSaveResume"
import useUnloadWarning from "@resume/ui/hooks/use-unload-warning"
import { ResumeServerData } from "utils/types"
import { mapToResumeValues, mapReduxResumeToFormValues } from "utils/utils"
import TemplateSelector from "./TemplateSelector"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@resume/ui/resizable";
import { useAppSelector, useAppDispatch } from "utils/lib/redux/hooks"
import { selectResume, setResume, initialResumeState } from "utils/lib/redux/resumeSlice"

interface ResumeEditorProps {
    resumeToEdit: ResumeServerData | null;
}

export default function ResumeEditor({ resumeToEdit } : ResumeEditorProps) {
    const searchParams = useSearchParams();
    const storedResume = useAppSelector(selectResume);
    const dispatch = useAppDispatch();

    // Priority order: Redux state > Database resume > Empty form
    const getInitialResumeData = (): ResumeValues => {
        // Check if Redux has parsed resume data (from upload)
        const hasReduxData = storedResume && (
            storedResume.profile.name || 
            storedResume.profile.email || 
            storedResume.workExperiences.some(exp => exp.company) ||
            storedResume.educations.some(edu => edu.school) ||
            storedResume.projects.some(proj => proj.project)
        );

        if (hasReduxData) {
            console.log('Using Redux state for resume data');
            return {
                ...mapReduxResumeToFormValues(storedResume),
                selectedTemplate: 'simple'
            } as ResumeValues;
        }
        
        // Fall back to database resume if editing existing
        if (resumeToEdit) {
            console.log('Using database resume for resume data');
            return mapToResumeValues(resumeToEdit);
        }
        
        // Default empty form
        console.log('Using empty form for resume data');
        return { 
            selectedTemplate: 'simple',
            skillSections: []
        } as ResumeValues;
    };

    const [resumeData, setResumeData] = useState<ResumeValues>(getInitialResumeData());
    
    // Clear Redux state if we're starting a new resume (not from upload and not editing existing)
    useEffect(() => {
        const hasReduxData = storedResume && (
            storedResume.profile.name || 
            storedResume.profile.email || 
            storedResume.workExperiences.some(exp => exp.company) ||
            storedResume.educations.some(edu => edu.school) ||
            storedResume.projects.some(proj => proj.project)
        );
        
        // If we have Redux data but no resumeToEdit, it means we used the Redux data and should clear it
        // to prevent it from interfering with future resume creation
        if (hasReduxData && !resumeToEdit) {
            // Small delay to ensure the form is populated first
            const timeoutId = setTimeout(() => {
                console.log('Clearing Redux state after successful form population');
                dispatch(setResume(initialResumeState));
            }, 1000);
            
            return () => clearTimeout(timeoutId);
        }
    }, [dispatch, resumeToEdit, storedResume]);
    
    console.log('resumeData', resumeData)
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
                        "flex flex-col h-full",
                        showResumePreviewOnSmallScreen && "hidden"
                      )}>
                      <div className="h-full min-h-0">
                        <div className="flex flex-col justify-between w-full h-[90vh] p-3 overflow-y-auto space-y-12 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                          
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
                      <ResizablePanel
                        defaultSize={50}
                        className={cn(
                          "flex flex-col overflow-hidden max-w-[600px]",
                          showResumePreviewOnSmallScreen && "flex"
                        )}
                      >
                        <div className="p-2 min-h-0 overflow-y-auto bg-gray-200 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                          <ResumePreviewSection
                            resumeData={resumeData}
                            setResumeData={setResumeData}
                            selectedTemplate={selectedTemplate}
                          />
                        </div>
                      </ResizablePanel>
                        <ResizableHandle />
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


