import { Button } from "@resume/ui/button";
import Link from "next/link";
import { steps } from "./steps";
import { FileUserIcon, PenLineIcon } from "lucide-react";
import cn from "@resume/ui/cn";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import { ResumeValues } from "utils/validations";
import FontSizeSelector from "./FontSizeSelector";
import FontStyleSelector from "./FontStyleSelector";


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
        <footer className="w-full  border-t px-3 py-5">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
                <div className="flex  itexms-center gap-3">
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
                        className="lg:hidden"
                        title={
                            showResumePreviewOnSmallScreen ? "Show input form" : "Show resume previews"
                        }
                    >
                        {showResumePreviewOnSmallScreen ? <PenLineIcon /> : <FileUserIcon />}
                    </Button>
                    <p className={cn("text-muted-foreground opacity-0", isSaving && 'opacity-100')}>Saving...</p>
                </div>
              

                <div className="flex items-start gap-3">
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
                    <BorderStyleButton 
                        //@ts-ignore
                        borderStyle={resumeData.borderStyle} 
                        onChange={(borderStyle) => setResumeData({ ...resumeData, borderStyle })}    
                    />
                    <FontSizeSelector
                        //@ts-ignore
                        label="Primary Font Size"
                        fontSize={resumeData.primaryFontSize || "medium"}
                        onFontSizeChange={(fontSize) =>
                        setResumeData({ ...resumeData, primaryFontSize: fontSize })
                        }
                    />
                    <FontSizeSelector
                        //@ts-ignore
                        label="Secondary Font Size"
                        fontSize={resumeData.secondaryFontSize || "small"}
                        onFontSizeChange={(fontSize) =>
                        setResumeData({ ...resumeData, secondaryFontSize: fontSize })
                        }
                    />
                    <FontStyleSelector
                        fontStyle={resumeData.fontStyle || "Arial"}
                        onFontStyleChange={(fontStyle) =>
                        setResumeData({ ...resumeData, fontStyle })
                        }
                    />
                    <Button variant="secondary" asChild>
                        <Link href="/resumes">Close</Link>
                    </Button>
                </div>
            </div>
        </footer>
    )
}


// import { Button } from "@resume/ui/button";
// import Link from "next/link";
// import { steps } from "./steps";
// import { FileUserIcon, PenLineIcon } from "lucide-react";
// import cn from "@resume/ui/cn";
// import ColorPicker from "./ColorPicker";
// import BorderStyleButton from "./BorderStyleButton";
// import { ResumeValues } from "utils/validations";
// import FontSizeSelector from "./FontSizeSelector";
// import FontStyleSelector from "./FontStyleSelector";
// import { Dock, DockIcon } from "@resume/ui/dock"

// interface FooterProps {
//     currentStep: string;
//     setCurrentStep: (step: string) => void;
//     showResumePreviewOnSmallScreen: boolean;
//     setShowResumePreviewOnSmallScreen: (show: boolean) => void;
//     resumeData: ResumeValues;
//     setResumeData: (resumeData: ResumeValues) => void;
//     isSaving: boolean;
// }

// export default function Footer({
//     currentStep, 
//     setCurrentStep, 
//     showResumePreviewOnSmallScreen, 
//     setShowResumePreviewOnSmallScreen,
//     resumeData, 
//     setResumeData,
//     isSaving
// } : FooterProps) {

//     const previousStep = steps.find((_, index) => steps[index + 1]?.key === currentStep)?.key;
//     const nextStep = steps.find((_, index) => steps[index - 1]?.key === currentStep)?.key;

//     return (
//         <footer className="flex flex-col items-center w-full px-3 py-5">
//                 <div className="flex gap-3">
//                     <Button 
//                         variant="secondary"
//                         onClick={previousStep ? () => setCurrentStep(previousStep) : undefined}
//                         disabled={!previousStep}
//                     >
//                         Previous step
//                     </Button>
//                     <Button
//                         onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
//                         disabled={!nextStep}
//                     >
//                         Next step
//                     </Button>
//                     <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => setShowResumePreviewOnSmallScreen(!showResumePreviewOnSmallScreen)}
//                         className="md:hidden"
//                         title={
//                             showResumePreviewOnSmallScreen ? "Show input form" : "Show resume previews"
//                         }
//                     >
//                         {showResumePreviewOnSmallScreen ? <PenLineIcon /> : <FileUserIcon />}
//                     </Button>
//                     <p className={cn("text-muted-foreground opacity-0", isSaving && 'opacity-100')}>Saving...</p>
//                 </div>
//                 <div className="relative">
//                     <Dock direction="middle">
//                         {/* <DockIcon> */}
//                         {/* <Icons.gitHub className="size-6" /> */}
//                         <ColorPicker 
//                         primaryColor={resumeData.primaryColorHex}
//                         secondaryColor={resumeData.secondaryColorHex}
//                         onPrimaryColorChange={(color) =>
//                         setResumeData({ ...resumeData, primaryColorHex: color.hex })
//                         }
//                         onSecondaryColorChange={(color) =>
//                         setResumeData({ ...resumeData, secondaryColorHex: color.hex })
//                         } />

//                         <BorderStyleButton 
//                         //@ts-ignore
//                         borderStyle={resumeData.borderStyle} 
//                         onChange={(borderStyle) => setResumeData({ ...resumeData, borderStyle })}    
//                     />
              
//                     <Button variant="secondary" asChild>
//                         <Link href="/resumes">Close</Link>
//                     </Button>
                    
                    
//                     </Dock>
//                 </div>

//                 {/* <div className="flex items-start gap-3">
//                     <ColorPicker 
//                         primaryColor={resumeData.primaryColorHex}
//                         secondaryColor={resumeData.secondaryColorHex}
//                         onPrimaryColorChange={(color) =>
//                         setResumeData({ ...resumeData, primaryColorHex: color.hex })
//                         }
//                         onSecondaryColorChange={(color) =>
//                         setResumeData({ ...resumeData, secondaryColorHex: color.hex })
//                         }
//                     />
//                     <BorderStyleButton 
//                         //@ts-ignore
//                         borderStyle={resumeData.borderStyle} 
//                         onChange={(borderStyle) => setResumeData({ ...resumeData, borderStyle })}    
//                     />
//                     <FontSizeSelector
//                         //@ts-ignore
//                         label="Primary Font Size"
//                         fontSize={resumeData.primaryFontSize || "medium"}
//                         onFontSizeChange={(fontSize) =>
//                         setResumeData({ ...resumeData, primaryFontSize: fontSize })
//                         }
//                     />
//                     <FontSizeSelector
//                         //@ts-ignore
//                         label="Secondary Font Size"
//                         fontSize={resumeData.secondaryFontSize || "small"}
//                         onFontSizeChange={(fontSize) =>
//                         setResumeData({ ...resumeData, secondaryFontSize: fontSize })
//                         }
//                     />
//                     <FontStyleSelector
//                         fontStyle={resumeData.fontStyle || "Arial"}
//                         onFontStyleChange={(fontStyle) =>
//                         setResumeData({ ...resumeData, fontStyle })
//                         }
//                     />
//                     <Button variant="secondary" asChild>
//                         <Link href="/resumes">Close</Link>
//                     </Button>
//                 </div> */}
//         </footer>
//     )
// }