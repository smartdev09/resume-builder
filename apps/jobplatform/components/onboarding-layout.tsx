import type React from "react";
import { LogoutButton } from "@/components/logout-button";
import { OrionLogo } from "@/components/orion-logo";
import ThemeToggle from "@resume/ui/ThemeToggle";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="shadow-sm">
        <div className="max-w-7xl mx-auto p-3 flex items-center justify-between gap-3">
          <div>
            <OrionLogo />
            <p className="text-xs">Job Platform integrated with Resume Builder</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto w-full px-3 py-6">
        {children}
      </main>
    </div>
  );
}
