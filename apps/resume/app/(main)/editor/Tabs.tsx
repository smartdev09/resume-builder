import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@resume/ui/tooltip"
import { steps } from "./steps";
import React, { useState } from "react";
import LottieAnimation from "app/components/LottieAnimation";

interface BreadcrumbsProps {
    currentStep: string;
    setCurrentStep: (step: string) => void;
}

export default function Tabs({ currentStep, setCurrentStep}: BreadcrumbsProps) {
    const [activeAnimation, setActiveAnimation] = useState<string | null>(null);

    const handleStepClick = (step: string) => {
        setCurrentStep(step);
        setActiveAnimation(step);
    };

    return(
        <div className="flex justify-center shadow-inner shadow-gray-300 border  border-gray-50 rounded-xl max-w-xl mx-auto gap-4 mt-4 pt-2 pb-2 pl-4 pr-4 w-fit">
            <TooltipProvider >
                {steps && steps.map((step, index) => (
                    <Tooltip key={step.key}>

                        <div className="flex justify-center  rounded-sm">
                            <div 
                                onClick={() => handleStepClick(step.key)}
                                >
                                <TooltipTrigger>
                                    <LottieAnimation 
                                        isStopped={activeAnimation !== step.key} 
                                        srcIndex={index} 
                                    /> 
                                    <TooltipContent side="bottom">
                                        {step.title}
                                    </TooltipContent>           
                                </TooltipTrigger>
                                {/* <p className="text-xs">{step.title}</p> */}
                            </div>
                        </div>


                    </Tooltip>
                ))}
            </TooltipProvider>
        </div>
    )
}