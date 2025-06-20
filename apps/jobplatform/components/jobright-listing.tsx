"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScrapedJob } from "../types/job-types";
import { toast } from "@resume/ui/sonner";
import { FilterDropdowns } from "./filter-dropdowns";
import { JobInteractionsService } from "../services/job-interactions-service";
import { WelcomeBackBanner } from "./welcome-back-banner";
import { PreferencesUpdateModal } from "./preferences-update-modal";
import { ApplyConfirmationModal } from "./apply-confirmation-modal";
import { JobNavigationTabs } from "./job-navigation-tabs";
import { JobResultsList } from "./job-results-list";
import { JobStatisticsHeader } from "./job-statistics-header";
import OrionAssistant from "./orion-assistant";

interface JobListingPageProps {
  jobs: ScrapedJob[];
  onLoadMore?: () => void;
  hasMoreJobs?: boolean;
  isLoading?: boolean;
  userPreferences?: {
    jobFunction: string;
    jobType: string;
    location: string;
    openToRemote: boolean;
    needsSponsorship: boolean;
  };
  isAutoLoaded?: boolean;
}

export function JobrightListing({ jobs, onLoadMore, hasMoreJobs, isLoading, userPreferences, isAutoLoaded }: JobListingPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'jobs' | 'liked' | 'applied' | 'external'>('jobs');
  const [likedJobs, setLikedJobs] = useState<Set<number>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [externalJobs, setExternalJobs] = useState<Set<number>>(new Set());
  const [userEmail] = useState<string>("user@example.com");
  const [interactionsLoaded, setInteractionsLoaded] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [currentUserPreferences, setCurrentUserPreferences] = useState(userPreferences);

  const [showApplyConfirmation, setShowApplyConfirmation] = useState(false);
  const [pendingJobApplication, setPendingJobApplication] = useState<{
    jobId: number;
    jobUrl?: string;
    job?: ScrapedJob;
  } | null>(null);

  useEffect(() => {
    const loadInteractions = async () => {
      if (jobs.length === 0 || interactionsLoaded) return;

      try {
        const jobIds = jobs.map(job => job.id);
        const statusMap = await JobInteractionsService.getJobInteractionStatus(userEmail, jobIds);

        const liked = new Set<number>();
        const applied = new Set<number>();
        const external = new Set<number>();

        Object.entries(statusMap).forEach(([jobId, interactions]) => {
          const id = parseInt(jobId);
          if (interactions.includes('LIKED')) liked.add(id);
          if (interactions.includes('APPLIED')) applied.add(id);
          if (interactions.includes('SAVED_EXTERNAL')) external.add(id);
        });

        setLikedJobs(liked);
        setAppliedJobs(applied);
        setExternalJobs(external);
        setInteractionsLoaded(true);
      } catch (error) {
        console.error('Failed to load job interactions:', error);
        setInteractionsLoaded(true);
      }
    };

    loadInteractions();
  }, [jobs, userEmail, interactionsLoaded]);
  
  const [filters, setFilters] = useState({
    workType: [] as string[], // Remote, Onsite, Hybrid
    jobLevel: [] as string[], // Entry Level, Mid Level, Senior Level
    jobType: [] as string[], // Full-time, Part-time, Contract
    datePosted: '' as string, // Last 24 hours, Last week, Last month
    minMatchScore: 0 as number // Minimum match score
  });

  const applyManualFiltersOnly = (jobsToFilter: ScrapedJob[]) => {
    return jobsToFilter.filter(job => {
      // Work Type filter
      if (filters.workType.length > 0) {
        const jobWorkType = job.is_remote ? 'Remote' : 
                           job.work_from_home_type === 'hybrid' ? 'Hybrid' : 'Onsite';
        if (!filters.workType.includes(jobWorkType)) return false;
      }

      // Job Level filter
      if (filters.jobLevel.length > 0) {
        const jobLevel = job.job_level || 'Entry Level';
        if (!filters.jobLevel.some(level => jobLevel.toLowerCase().includes(level.toLowerCase()))) {
          return false;
        }
      }

      // Job Type filter
      if (filters.jobType.length > 0) {
        const jobType = job.job_type || 'Full-time';
        if (!filters.jobType.some(type => jobType.toLowerCase().includes(type.toLowerCase()))) {
          return false;
        }
      }

      // Date Posted filter
      if (filters.datePosted) {
        const jobDate = new Date(job.date_posted || Date.now());
        const now = new Date();
        const timeDiff = now.getTime() - jobDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        switch (filters.datePosted) {
          case 'Last 24 hours':
            if (daysDiff > 1) return false;
            break;
          case 'Last week':
            if (daysDiff > 7) return false;
            break;
          case 'Last month':
            if (daysDiff > 30) return false;
            break;
        }
      }

      // Match Score filter
      if (filters.minMatchScore > 0) {
        const matchScore = job.matchScore || 0;
        if (matchScore < filters.minMatchScore) return false;
      }

      return true;
    });
  };

  const applyFilters = (jobsToFilter: ScrapedJob[]) => {
    return jobsToFilter.filter(job => {
      // Work Type filter
      if (filters.workType.length > 0) {
        const jobWorkType = job.is_remote ? 'Remote' : 
                           job.work_from_home_type === 'hybrid' ? 'Hybrid' : 'Onsite';
        if (!filters.workType.includes(jobWorkType)) return false;
      }

      // Job Level filter
      if (filters.jobLevel.length > 0) {
        const jobLevel = job.job_level || 'Entry Level';
        if (!filters.jobLevel.some(level => jobLevel.toLowerCase().includes(level.toLowerCase()))) {
          return false;
        }
      }

      // Job Type filter
      if (filters.jobType.length > 0) {
        const jobType = job.job_type || 'Full-time';
        if (!filters.jobType.some(type => jobType.toLowerCase().includes(type.toLowerCase()))) {
          return false;
        }
      }

      // Date Posted filter
      if (filters.datePosted) {
        const jobDate = new Date(job.date_posted || Date.now());
        const now = new Date();
        const timeDiff = now.getTime() - jobDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        switch (filters.datePosted) {
          case 'Last 24 hours':
            if (daysDiff > 1) return false;
            break;
          case 'Last week':
            if (daysDiff > 7) return false;
            break;
          case 'Last month':
            if (daysDiff > 30) return false;
            break;
        }
      }

      // Match Score filter
      if (filters.minMatchScore > 0) {
        const matchScore = job.matchScore || 0;
        if (matchScore < filters.minMatchScore) return false;
      }

      return true;
    });
  };

  const getFilteredJobs = () => {
    let tabFilteredJobs: ScrapedJob[];
    
    switch (activeTab) {
      case 'liked':
        tabFilteredJobs = jobs.filter(job => likedJobs.has(job.id));
        break;
      case 'applied':
        tabFilteredJobs = jobs.filter(job => appliedJobs.has(job.id));
        break;
      case 'external':
        tabFilteredJobs = jobs.filter(job => externalJobs.has(job.id));
        break;
      default:
        tabFilteredJobs = jobs;
        return applyFilters(tabFilteredJobs);
    }

    return applyManualFiltersOnly(tabFilteredJobs);
  };

  const filteredJobs = getFilteredJobs();

  const handleFilterChange = (filterType: keyof typeof filters, value: string | number) => {
    setFilters(prev => {
      if (filterType === 'workType' || filterType === 'jobLevel' || filterType === 'jobType') {
        const currentArray = prev[filterType] as string[];
        const newArray = currentArray.includes(value as string)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value as string];
        return { ...prev, [filterType]: newArray };
      } else {
        return { ...prev, [filterType]: value };
      }
    });
  };

  const clearAllFilters = () => {
    setFilters({
      workType: [],
      jobLevel: [],
      jobType: [],
      datePosted: '',
      minMatchScore: 0
    });
    toast.success('All filters cleared');
  };

  const getActiveFilterCount = () => {
    return filters.workType.length + 
           filters.jobLevel.length + 
           filters.jobType.length + 
           (filters.datePosted ? 1 : 0) + 
           (filters.minMatchScore > 0 ? 1 : 0);
  };

  const handleLikeJob = async (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    const isLiked = likedJobs.has(jobId);
    
    try {
      if (isLiked) {
        await JobInteractionsService.unlikeJob(userEmail, jobId);
        setLikedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        toast.success(`Removed ${job?.title || 'job'} from liked jobs`);
      } else {
        await JobInteractionsService.likeJob(userEmail, jobId);
        setLikedJobs(prev => {
          const newSet = new Set(prev);
          newSet.add(jobId);
          return newSet;
        });
        toast.success(`Added ${job?.title || 'job'} to liked jobs`);
      }
    } catch (error) {
      console.error('Failed to update like status:', error);
      toast.error("Failed to update like status");
    }
  };

  const handleApplyJob = async (jobId: number, jobUrl?: string) => {
    const job = jobs.find(j => j.id === jobId);
    
    setPendingJobApplication({ jobId, jobUrl, job });
    setShowApplyConfirmation(true);
    
    if (jobUrl) {
      window.open(jobUrl, '_blank');
    }
  };

  const handleApplyConfirmation = async (userApplied: boolean) => {
    if (!pendingJobApplication) return;
    
    const { jobId, job } = pendingJobApplication;
    
    try {
      if (userApplied) {
        await JobInteractionsService.markJobAsApplied(userEmail, jobId);
        setAppliedJobs(prev => new Set([...prev, jobId]));
        toast.success(`Marked ${job?.title || 'job'} as applied`);
      } else {
        toast.info("Application status not updated");
      }
    } catch (error) {
      console.error('Failed to mark job as applied:', error);
      toast.error("Failed to update application status");
    } finally {
      setShowApplyConfirmation(false);
      setPendingJobApplication(null);
    }
  };

  const handleExternalJob = async (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    const isSaved = externalJobs.has(jobId);
    
    try {
      if (isSaved) {
        await JobInteractionsService.removeInteraction({
          userEmail,
          jobId,
          interactionType: 'SAVED_EXTERNAL'
        });
        setExternalJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        toast.success(`Removed ${job?.title || 'job'} from saved jobs`);
      } else {
        await JobInteractionsService.saveJobExternal(userEmail, jobId);
        setExternalJobs(prev => {
          const newSet = new Set(prev);
          newSet.add(jobId);
          return newSet;
        });
        toast.success(`Saved ${job?.title || 'job'} for later`);
      }
    } catch (error) {
      console.error('Failed to update external save status:', error);
      toast.error("Failed to update external save status");
    }
  };

  const handleJobClick = (job: ScrapedJob) => {
    router.push(`/jobs/${job.id}`);
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <JobNavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          likedCount={likedJobs.size}
          appliedCount={appliedJobs.size}
          externalCount={externalJobs.size}
          userPreferences={userPreferences}
        />
        <div className="flex items-center justify-between">
          <FilterDropdowns
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAllFilters={clearAllFilters}
            getActiveFilterCount={getActiveFilterCount}
          />
        </div>

        {isAutoLoaded && currentUserPreferences && (
          <WelcomeBackBanner 
            preferences={currentUserPreferences}
            jobCount={jobs.length}
            onUpdatePreferences={() => setShowPreferencesModal(true)}
          />
        )}

        <JobStatisticsHeader
          totalJobsToday={Math.floor(jobs.length * 0.3)}
          totalJobs={jobs.length}
          activeTab={activeTab}
          filteredJobsCount={filteredJobs.length}
        />

        <JobResultsList
          jobs={filteredJobs}
          matchedJobs={filteredJobs}
          isLoadingMore={isLoading || false}
          hasMore={hasMoreJobs || false}
          activeTab={activeTab}
          onLoadMore={onLoadMore || (() => {})}
          onJobClick={handleJobClick}
          onLikeJob={handleLikeJob}
          onApplyJob={handleApplyJob}
          onExternalJob={handleExternalJob}
          isJobLiked={(jobId) => likedJobs.has(jobId)}
          isJobApplied={(jobId) => appliedJobs.has(jobId)}
          isJobExternal={(jobId) => externalJobs.has(jobId)}
        />
      </div>

      <div className="w-80 space-y-4">
        <OrionAssistant/>
      </div>

      {currentUserPreferences && (
        <PreferencesUpdateModal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          currentPreferences={currentUserPreferences}
          userEmail={userEmail}
          onPreferencesUpdated={(newPreferences) => {
            setCurrentUserPreferences(newPreferences);
          }}
        />
      )}

      {pendingJobApplication && (
        <ApplyConfirmationModal
          isOpen={showApplyConfirmation}
          onClose={() => {
            setShowApplyConfirmation(false);
            setPendingJobApplication(null);
          }}
          onConfirm={handleApplyConfirmation}
          jobTitle={pendingJobApplication.job?.title || "this job"}
          company={pendingJobApplication.job?.company || "this company"}
        />
      )}
    </div>
  );
} 