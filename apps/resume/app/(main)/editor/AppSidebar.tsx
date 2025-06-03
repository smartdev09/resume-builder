'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@resume/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Tabs from "./Tabs";
import { steps } from "./steps";
import UserButton from "../../components/UserButton";
import ThemeToggle from "@resume/ui/ThemeToggle";
import { User } from "lucide-react";
import { Button } from "@resume/ui/button";

export function AppSidebar() {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || steps[0]!.key;
  const { data: session } = useSession();
  
  function setCurrentStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r"
      style={{
        '--sidebar-width': '3.5rem',
        '--sidebar-width-icon': '3rem',
      } as React.CSSProperties}
    >
      <SidebarContent className="bg-gray-100 dark:bg-[#242627] dark:border-[hsl(0,0,17)] h-full p-1">
        <Tabs 
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </SidebarContent>
      
      {/* Footer with user controls */}
      <SidebarFooter className="p-1 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center gap-1">
          {/* Theme Toggle */}
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
          
          {/* User Button */}
          <div className="flex justify-center">
            {session?.user ? (
              <UserButton user={session.user} />
            ) : (
              <Button size="icon" variant="ghost">
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}