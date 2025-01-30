import React, { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@resume/ui/tooltip";

import { steps } from "./steps";
import LottieAnimation from "../../components/LottieAnimation";

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
        <TooltipProvider >
            {steps && steps.map((step, index) => (
                <Tooltip key={step.key}>
                    <div className="flex justify-center rounded-sm">
                        <div onClick={() => handleStepClick(step.key)}>
                            <TooltipTrigger>
                                <LottieAnimation 
                                    isStopped={activeAnimation !== step.key} 
                                    srcIndex={index} 
                                /> 
                                <TooltipContent side="right">
                                    {step.title}
                                </TooltipContent>           
                            </TooltipTrigger>
                        </div>
                    </div>
                </Tooltip>
            ))}
        </TooltipProvider>
    )
}