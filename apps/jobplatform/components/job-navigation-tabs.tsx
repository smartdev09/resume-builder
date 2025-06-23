"use client";

import { Briefcase } from "lucide-react";
import { Badge } from "@resume/ui/badge";
import { Button } from "@resume/ui/button";

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
      <nav className="flex items-center gap-1 mb-4">
        <Button 
          variant={activeTab === 'jobs' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('jobs')}
          className="gap-1"
        >
          <Briefcase className="w-4 h-4" />
          JOBS
        </Button>
        <Button 
          variant={activeTab === 'liked' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('liked')}
          className="gap-1"
        >
          Liked <Badge variant="secondary" className="ml-1">{likedCount}</Badge>
        </Button>
        <Button 
          variant={activeTab === 'applied' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('applied')}
          className="gap-1"
        >
          Applied <Badge variant="secondary" className="ml-1">{appliedCount}</Badge>
        </Button>
        <Button 
          variant={activeTab === 'external' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('external')}
          className="gap-1"
        >
          External <Badge variant="secondary" className="ml-1">{externalCount}</Badge>
        </Button>
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