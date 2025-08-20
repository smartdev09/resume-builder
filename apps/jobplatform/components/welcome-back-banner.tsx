"use client";

import { Button } from "@resume/ui/button";
import { Badge } from "@resume/ui/badge";
import { CheckCircle, Settings, Briefcase } from "lucide-react";

interface WelcomeBackBannerProps {
  preferences: {
    jobFunction: string;
    jobType: string;
    location: string;
    openToRemote: boolean;
    needsSponsorship: boolean;
  };
  jobCount: number;
  onUpdatePreferences?: () => void;
}

export function WelcomeBackBanner({ preferences, jobCount, onUpdatePreferences }: WelcomeBackBannerProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-6 mb-6 border border-primary/20">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/20 rounded-full">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-1">
                Welcome back! 🎉
              </h3>
              <p className="text-muted-foreground">
                We found your saved job preferences and loaded {jobCount} matching jobs for you.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {preferences.jobFunction}
              </Badge>
              <Badge variant="outline">{preferences.jobType}</Badge>
              <Badge variant="outline">{preferences.location}</Badge>
              {preferences.openToRemote && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Remote OK
                </Badge>
              )}
              {preferences.needsSponsorship && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  H1B Sponsorship
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {onUpdatePreferences && (
          <Button
            variant="outline"
            size="sm"
            onClick={onUpdatePreferences}
            className="shrink-0"
          >
            <Settings className="w-4 h-4 mr-2" />
            Update Preferences
          </Button>
        )}
      </div>
    </div>
  );
} 