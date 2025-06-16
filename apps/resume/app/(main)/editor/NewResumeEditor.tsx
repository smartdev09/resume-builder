'use client'

import { useState, useEffect } from "react";
import { ResumeValues } from "utils/validations";
import { ResumeServerData } from "utils/types";
import { mapToResumeValues, mapReduxResumeToFormValues } from "utils/utils";
import { useAppSelector, useAppDispatch } from "utils/lib/redux/hooks";
import { selectResume, setResume, initialResumeState } from "utils/lib/redux/resumeSlice";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@resume/ui/resizable";
import { ChevronDown, ChevronRight, ChevronLeft, Save } from "lucide-react";
import { steps } from "./steps";
import cn from "@resume/ui/cn";
import useAutoSaveReume from "./useAutoSaveResume";
import useUnloadWarning from "@resume/ui/hooks/use-unload-warning";
import FeatureToolbar from "./FeatureToolbar";
import ResumePreviewSection from "./ResumePreviewSection";
import TemplateSelector from "./TemplateSelector";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import FontSizeSelector from "./FontSizeSelector";
import FontStyleSelector from "./FontStyleSelector";
import { Button } from "@resume/ui/button";
import Link from "next/link";
import ATSAnalyzerTab from "./ats-analyzer/ATSAnalyzerTab";
import AIGeneratorTab from './ai-generator/AIGeneratorTab';

interface NewResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
}

export default function NewResumeEditor({ resumeToEdit }: NewResumeEditorProps) {
  const storedResume = useAppSelector(selectResume);
  const dispatch = useAppDispatch();
  
  const [activeFeature] = useState('resume-editor');
  const [activeTool, setActiveTool] = useState('edit');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general-info']));
  const [showResumePreviewOnSmallScreen, setShowResumePreviewOnSmallScreen] = useState(false);

  // Get initial resume data with same logic as before
  const getInitialResumeData = (): ResumeValues => {
    const hasReduxData = storedResume && (
      storedResume.profile.name || 
      storedResume.profile.email || 
      storedResume.workExperiences.some(exp => exp.company) ||
      storedResume.educations.some(edu => edu.school) ||
      storedResume.projects.some(proj => proj.project)
    );

    if (hasReduxData) {
      return {
        ...mapReduxResumeToFormValues(storedResume),
        selectedTemplate: 'simple'
      } as ResumeValues;
    }
    
    if (resumeToEdit) {
      return mapToResumeValues(resumeToEdit);
    }
    
    return { 
      selectedTemplate: 'simple',
      skillSections: []
    } as ResumeValues;
  };

  const [resumeData, setResumeData] = useState<ResumeValues>(getInitialResumeData());
  const [selectedTemplate, setSelectedTemplate] = useState(resumeData.selectedTemplate);

  const { isSaving, hasUnsavedData } = useAutoSaveReume(resumeData);
  useUnloadWarning(hasUnsavedData);

  // Clear Redux state logic (same as before)
  useEffect(() => {
    const hasReduxData = storedResume && (
      storedResume.profile.name || 
      storedResume.profile.email || 
      storedResume.workExperiences.some(exp => exp.company) ||
      storedResume.educations.some(edu => edu.school) ||
      storedResume.projects.some(proj => proj.project)
    );
    
    if (hasReduxData && !resumeToEdit) {
      const timeoutId = setTimeout(() => {
        dispatch(setResume(initialResumeState));
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, resumeToEdit, storedResume]);

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const renderToolContent = () => {
    switch (activeTool) {
      case 'edit':
        return (
          <div className="space-y-2 sm:space-y-3">
            {steps.map((step) => {
              const isExpanded = expandedSections.has(step.key);
              const FormComponent = step.component;
              
              return (
                <div key={step.key} className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(step.key)}
                    className="w-full flex items-center border-b border-gray-200 dark:border-gray-700 justify-between p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      )}
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">{step.title}</h3>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="pl-8 sm:pl-10 pr-3 sm:pr-4 pb-3 sm:pb-4">
                      <FormComponent
                        resumeData={resumeData}
                        setResumeData={setResumeData}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'templates':
        return (
          <div className="p-6">
            <div className="space-y-1.5 text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold">Choose Template</h2>
              <p className="text-sm text-muted-foreground">Select a template for your resume</p>
            </div>
            <TemplateSelector
              onSelectTemplate={setSelectedTemplate}
              setResumeData={setResumeData}
              resumeData={resumeData}
            />
          </div>
        );

      case 'style':
        return (
          <div className="p-6">
            <div className="space-y-1.5 text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold">Design Controls</h2>
              <p className="text-sm text-muted-foreground">Customize the appearance of your resume</p>
            </div>
            
            <div className="space-y-6">
              {/* Colors Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Colors</h3>
                <div className="flex justify-center">
                  <ColorPicker 
                    primaryColor={resumeData.primaryColorHex}
                    secondaryColor={resumeData.secondaryColorHex}
                    onPrimaryColorChange={(color) =>
                      setResumeData({ ...resumeData, primaryColorHex: color.hex })
                    }
                    onSecondaryColorChange={(color) =>
                      setResumeData({ ...resumeData, secondaryColorHex: color.hex })
                    }
                  />
                </div>
              </div>

              {/* Border Style Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Border Style</h3>
                <div className="flex justify-center">
                  <BorderStyleButton 
                    //@ts-ignore
                    borderStyle={resumeData.borderStyle} 
                    onChange={(borderStyle) => setResumeData({ ...resumeData, borderStyle })}    
                  />
                </div>
              </div>

              {/* Typography Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Typography</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Font Family</label>
                    <FontStyleSelector
                      fontStyle={resumeData.fontStyle || "Arial"}
                      onFontStyleChange={(fontStyle) =>
                        setResumeData({ ...resumeData, fontStyle })
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Font Size</label>
                      <FontSizeSelector
                        //@ts-ignore
                        fontSize={resumeData.primaryFontSize || "medium"}
                        onFontSizeChange={(fontSize) =>
                          setResumeData({ ...resumeData, primaryFontSize: fontSize })
                        }
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Secondary Font Size</label>
                      <FontSizeSelector
                        //@ts-ignore
                        fontSize={resumeData.secondaryFontSize || "small"}
                        onFontSizeChange={(fontSize) =>
                          setResumeData({ ...resumeData, secondaryFontSize: fontSize })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center items-center">
                  <div className="text-sm text-muted-foreground">
                    All changes are saved automatically
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai-generator':
        return <AIGeneratorTab 
          resumeData={resumeData} 
          setResumeData={setResumeData} 
          onSwitchToEdit={() => setActiveTool('edit')}
        />;

      case 'ats-analyzer':
        return <ATSAnalyzerTab resumeData={resumeData} setResumeData={setResumeData} />;

      default:
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Tool Not Found</h2>
            <p className="text-muted-foreground">The selected tool is not available yet.</p>
          </div>
        );
    }
  };

  return (
    <>
      {/* Navigation Header */}
      <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/resumes" className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Resumes</span>
            </Link>
          </Button>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Resume Editor
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center gap-2 text-sm text-muted-foreground opacity-0 transition-opacity", isSaving && 'opacity-100')}>
            <Save className="w-4 h-4" />
            <span>Saving...</span>
          </div>
          {hasUnsavedData && !isSaving && (
            <div className="text-sm text-amber-600 dark:text-amber-400">
              Unsaved changes
            </div>
          )}
        </div>
      </div>

      {/* Feature Toolbar */}
      <FeatureToolbar 
        activeFeature={activeFeature}
        activeTool={activeTool}
        onToolChange={setActiveTool}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex relative">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Content Panel */}
          <ResizablePanel 
            defaultSize={60} 
            minSize={30} 
            maxSize={80} 
            className={cn(
              "flex flex-col h-full",
              showResumePreviewOnSmallScreen && "hidden md:flex"
            )}
          >
            <div className="h-full min-h-0">
              <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-950 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                {renderToolContent()}
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="hidden md:flex" />
          
          {/* Preview Panel */}
          <ResizablePanel
            defaultSize={40}
            minSize={20}
            maxSize={70}
            className={cn(
              "flex-col overflow-hidden",
              showResumePreviewOnSmallScreen ? "flex" : "hidden md:flex"
            )}
          >
            <div className="h-full min-h-0 overflow-y-auto bg-gray-200 dark:bg-gray-800 p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full">
              <ResumePreviewSection
                resumeData={resumeData}
                setResumeData={setResumeData}
                selectedTemplate={selectedTemplate}
                onATSDetailsClick={() => setActiveTool('ats-analyzer')}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Mobile preview toggle */}
        <div className="absolute top-4 right-4 md:hidden z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResumePreviewOnSmallScreen(!showResumePreviewOnSmallScreen)}
          >
            {showResumePreviewOnSmallScreen ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>
    </>
  );
} 