'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@resume/ui/sidebar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserButton from "../../components/UserButton";
import ThemeToggle from "@resume/ui/ThemeToggle";
import { User, FileText, Briefcase } from "lucide-react";
import { Button } from "@resume/ui/button";

export function AppSidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const handleEditorNavigation = () => {
    router.push('/editor');
  };

  const handleJobPlatformNavigation = () => {
    router.push('http://localhost:3001');
  };

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
        <div className="flex flex-col items-center gap-2 pt-2">
          {/* Editor Icon */}
          <Button 
            size="icon" 
            variant="ghost"
            onClick={handleEditorNavigation}
            className="w-10 h-10"
            title="Resume Editor"
          >
            <FileText className="w-5 h-5" />
          </Button>
          
          {/* Job Platform Icon */}
          <Button 
            size="icon" 
            variant="ghost"
            onClick={handleJobPlatformNavigation}
            className="w-10 h-10"
            title="Job Platform"
          >
            <Briefcase className="w-5 h-5" />
          </Button>
        </div>
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