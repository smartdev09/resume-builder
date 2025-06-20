"use client";

import { useEffect } from "react";
import { ScrapedJob } from "../../types/job-types";
import { X } from "lucide-react";
import { JobDetailsHeader } from "./job-details-header";
import { JobDetailsInfo } from "./job-details-info";
import { JobDetailsDescription } from "./job-details-description";
import { JobDetailsActions } from "./job-details-actions";

interface JobDetailsModalProps {
  job: ScrapedJob | null;
  isOpen: boolean;
  onClose: () => void;
  isLiked?: boolean;
  isApplied?: boolean;
  isExternal?: boolean;
  onLike?: (jobId: number) => void;
  onApply?: (jobId: number, jobUrl?: string) => void;
  onExternal?: (jobId: number) => void;
}

export function JobDetailsModal({
  job,
  isOpen,
  onClose,
  isLiked,
  isApplied,
  isExternal,
  onLike,
  onApply,
  onExternal
}: JobDetailsModalProps) {
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <h2 className="text-xl font-semibold text-card-foreground">Job Details</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            <JobDetailsHeader job={job} />

            <JobDetailsInfo job={job} />

            <JobDetailsDescription job={job} />

            <JobDetailsActions
              job={job}
              isLiked={isLiked}
              isApplied={isApplied}
              isExternal={isExternal}
              onLike={onLike}
              onApply={onApply}
              onExternal={onExternal}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 