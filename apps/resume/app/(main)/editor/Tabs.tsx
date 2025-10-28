import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@resume/ui/tooltip";

import { steps } from "./steps";

const DynamicLottieAnimation = dynamic(
    () => import("../../components/LottieAnimation"),
    { 
        ssr: false, 
        loading: () => <div style={{ width: 36, height: 36, backgroundColor: '#e5e7eb', borderRadius: 2 }} />,
    }
);


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
                                {/* 4. Use the dynamic component instead of the direct import */}
                                <DynamicLottieAnimation 
                                    isStopped={activeAnimation !== step.key} 
                                    srcIndex={index} 
                                /> 
                                <TooltipContent side="right" className="bg-black text-white dark:bg-white">
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