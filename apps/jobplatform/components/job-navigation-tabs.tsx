"use client";

import { Briefcase } from "lucide-react";
import { Badge } from "@resume/ui/badge";

type TabType = "jobs" | "liked" | "applied" | "external";

interface JobNavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  likedCount: number;
  appliedCount: number;
  externalCount: number;
  userPreferences?: {
    jobFunction: string;
    jobType: string;
    location: string;
    openToRemote: boolean;
    needsSponsorship: boolean;
  };
}

export function JobNavigationTabs({
  activeTab,
  onTabChange,
  likedCount,
  appliedCount,
  externalCount,
  userPreferences
}: JobNavigationTabsProps) {
  return (
    <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
      <nav className="flex items-center gap-6 mb-4">
        <button 
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'jobs' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          onClick={() => onTabChange('jobs')}
        >
          <Briefcase className="w-4 h-4" />
          JOBS
        </button>
        <button 
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
            activeTab === 'liked' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          onClick={() => onTabChange('liked')}
        >
          Liked <Badge variant="secondary" className="ml-1">{likedCount}</Badge>
        </button>
        <button 
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
            activeTab === 'applied' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          onClick={() => onTabChange('applied')}
        >
          Applied <Badge variant="secondary" className="ml-1">{appliedCount}</Badge>
        </button>
        <button 
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
            activeTab === 'external' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          onClick={() => onTabChange('external')}
        >
          External <Badge variant="secondary" className="ml-1">{externalCount}</Badge>
        </button>
      </nav>

      {/* User Preferences Display */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {userPreferences && (
              <>
                <span className="font-medium text-card-foreground">{userPreferences.jobFunction}</span>
                <span className="text-muted-foreground">{userPreferences.location}</span>
                <span className="text-muted-foreground">{userPreferences.jobType}</span>
                {userPreferences.openToRemote && (
                  <span className="text-muted-foreground">Remote</span>
                )}
                {userPreferences.needsSponsorship && (
                  <span className="text-muted-foreground">H1B Sponsorship</span>
                )}
              </>
            )}
            {!userPreferences && (
              <>
                <span className="font-medium text-card-foreground">Backend Engineer</span>
                <span className="font-medium text-card-foreground">Full Stack Engineer</span>
                <span className="font-medium text-card-foreground">React Developer</span>
                <span className="text-muted-foreground">Within US</span>
                <span className="text-muted-foreground">Full-time</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 