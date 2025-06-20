"use client";

import { ScrapedJob } from "../types/job-types";
import { JobCard } from "./job-card";
import { Loader2 } from "lucide-react";
import { useInfiniteScroll } from "../hooks/use-infinite-scroll";

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
  
  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore
  });

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

      {/* Infinite scroll trigger and loading indicator */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isLoadingMore && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more jobs...</span>
          </div>
        )}
        {!hasMore && displayJobs.length > 0 && (
          <div className="text-center text-muted-foreground">
            <p>You've reached the end of available jobs</p>
          </div>
        )}
      </div>
    </div>
  );
} 