import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@resume/ui/breadcrumb";
import { steps } from "./steps";
import React from "react";
import DashboardIcon from "components/DashboardIcon";
import LottieAnimation from "components/LottieAnimation";
import EducationIcon from "components/EducationIcon";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@resume/ui/tooltip"
import { Button } from "@resume/ui/button";

interface BreadcrumbsProps {
    currentStep: string;
    setCurrentStep: (step: string) => void;
}

export default function Breadcrumbs({ currentStep, setCurrentStep}: BreadcrumbsProps) {
    return(
        <div className="flex justify-center">
            <Breadcrumb>
                <BreadcrumbList>
                    {steps.map((step, index) => (
                        <React.Fragment key={step.key}>
                            <BreadcrumbItem>
                                {step.key === currentStep ? (
                                    <BreadcrumbPage>
                                        <LottieAnimation srcIndex={index} /> 
                                            <p>{step.title}</p>
                                        </BreadcrumbPage>
                                ) : (
                                    <button onClick={() => setCurrentStep(step.key)}>
                                       <div className="w-full flex justify-center">
                                        <EducationIcon />
                                       </div>
                                        <p>{step.title}</p>
                                    </button>
                                )}
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="last:hidden"/>
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}