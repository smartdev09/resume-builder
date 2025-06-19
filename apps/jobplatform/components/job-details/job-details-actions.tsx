"use client";

import { ScrapedJob } from "../../types/job-types";
import { Heart, Bookmark, ExternalLink, MessageSquare } from "lucide-react";
import { Button } from "@resume/ui/button";

interface JobDetailsActionsProps {
  job: ScrapedJob;
  isLiked?: boolean;
  isApplied?: boolean;
  isExternal?: boolean;
  onLike?: (jobId: number) => void;
  onApply?: (jobId: number, jobUrl?: string) => void;
  onExternal?: (jobId: number) => void;
  onClose: () => void;
}

export function JobDetailsActions({
  job,
  isLiked,
  isApplied,
  isExternal,
  onLike,
  onApply,
  onExternal
}: JobDetailsActionsProps) {
  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          className={`flex-1 px-6 py-3 text-base font-medium ${
            isApplied 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
          onClick={() => onApply?.(job.id, job.job_url)}
          disabled={isApplied}
        >
          {isApplied ? (
            <>
              ✓ APPLIED
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              APPLY NOW
            </>
          )}
        </Button>

        <Button 
          variant="outline" 
          className="flex-1 sm:flex-none px-6 py-3 text-base font-medium"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          ASK ORION
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLiked 
                ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20' 
                : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
            }`}
            onClick={() => onLike?.(job.id)}
            title={isLiked ? "Unlike job" : "Like job"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Liked' : 'Like'}
          </button>

          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isExternal 
                ? 'text-blue-500 bg-blue-500/10 hover:bg-blue-500/20' 
                : 'text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10'
            }`}
            onClick={() => onExternal?.(job.id)}
            title={isExternal ? "Remove from saved" : "Save for later"}
          >
            <Bookmark className={`w-4 h-4 ${isExternal ? 'fill-current' : ''}`} />
            {isExternal ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
} 