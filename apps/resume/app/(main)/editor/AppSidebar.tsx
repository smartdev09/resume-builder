'use client'

import {
  Sidebar,
  SidebarContent,
} from "@resume/ui/sidebar";
import { useSearchParams } from "next/navigation";
import Tabs from "./Tabs";
import { steps } from "./steps";

export function AppSidebar() {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || steps[0]!.key;
  
  function setCurrentStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  return (
    <div className="h-screen  flex items-center">
      <Sidebar
        variant="floating"
        collapsible="icon"
        className="h-fit top-1/2 left-0 transform -translate-y-1/2 rounded-lg"
      >
        <SidebarContent className="bg-[#242627] border-[hsl(0,0,17)] border rounded-md p-2">
          <Tabs 
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </SidebarContent>
      </Sidebar>
    </div>
  );
}