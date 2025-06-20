"use client";

import { ScrapedJob } from "../types/job-types";
import { JobCard } from "./job-card";
import { Button } from "@resume/ui/button";
import { Loader2 } from "lucide-react";

interface JobResultsListProps {
  jobs: ScrapedJob[];
  matchedJobs: ScrapedJob[];
  isLoadingMore: boolean;
  hasMore: boolean;
  activeTab: string;
  onLoadMore: () => void;
  onJobClick: (job: ScrapedJob) => void;
  onLikeJob: (jobId: number) => void;
  onApplyJob: (jobId: number, jobUrl?: string) => void;
  onExternalJob: (jobId: number) => void;
  isJobLiked: (jobId: number) => boolean;
  isJobApplied: (jobId: number) => boolean;
  isJobExternal: (jobId: number) => boolean;
  noResultsMessage?: string;
}

export function JobResultsList({
  jobs,
  matchedJobs,
  isLoadingMore,
  hasMore,
  activeTab,
  onLoadMore,
  onJobClick,
  onLikeJob,
  onApplyJob,
  onExternalJob,
  isJobLiked,
  isJobApplied,
  isJobExternal,
  noResultsMessage
}: JobResultsListProps) {
  const displayJobs = activeTab === "jobs" ? matchedJobs : jobs;

  if (displayJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {noResultsMessage || "No jobs found"}
        </h3>
        <p className="text-muted-foreground max-w-md">
          {activeTab === "jobs" 
            ? "Try adjusting your filters or check back later for new opportunities."
            : "You haven't interacted with any jobs in this category yet."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isLiked={isJobLiked(job.id)}
          isApplied={isJobApplied(job.id)}
          isExternal={isJobExternal(job.id)}
          onLike={onLikeJob}
          onApply={onApplyJob}
          onExternal={onExternalJob}
          onJobClick={onJobClick}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center py-8">
          <Button
            disabled={isLoadingMore}
            onClick={onLoadMore}
            className="px-8 py-3"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading more jobs...
              </>
            ) : (
              "Load More Jobs"
            )}
          </Button>
        </div>
      )}
    </div>
  );
} 