"use client";

import { useState, useEffect } from "react";
import { ScrapedJob } from "../types/job-types";
import { MapPin, Clock, Building2, Briefcase, Filter, ChevronDown, MoreHorizontal, Heart, Bookmark, Calendar, MessageSquare, X } from "lucide-react";
import { Button } from "@resume/ui/button";
import { Badge } from "@resume/ui/badge";
import { toast } from "@resume/ui/sonner";
import { formatTimeAgoWithTooltip } from "../lib/time-utils";
import { FilterDropdowns } from "./filter-dropdowns";
import { JobInteractionsService, JobInteractionType } from "../services/job-interactions-service";
import { WelcomeBackBanner } from "./welcome-back-banner";
import { PreferencesUpdateModal } from "./preferences-update-modal";

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
  isAutoLoaded?: boolean; // Indicates if jobs were loaded from saved preferences
}

interface JobCardProps {
  job: ScrapedJob;
  matchScore?: number;
  isLiked?: boolean;
  isApplied?: boolean;
  isExternal?: boolean;
  onLike?: (jobId: number) => void;
  onApply?: (jobId: number, jobUrl?: string) => void;
  onExternal?: (jobId: number) => void;
}

const JobCard = ({ job, matchScore, isLiked, isApplied, isExternal, onLike, onApply, onExternal }: JobCardProps) => {
  console.log(job);
  
  const actualMatchScore = job.matchScore || matchScore || Math.floor(Math.random() * 30) + 70;
  
  const { timeAgo, exactDate } = formatTimeAgoWithTooltip(job.date_posted);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-yellow-500";
    return "text-muted-foreground";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return "STRONG MATCH";
    if (score >= 80) return "GOOD MATCH";
    return "FAIR MATCH";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span title={exactDate}>{timeAgo}</span>
            <button className="ml-auto text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            {job.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-medium text-card-foreground">{job.company}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{job.company_industry || "Software"}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Public Company</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.job_type || "Full-time"}
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {job.is_remote ? "Remote" : "Onsite"}
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.job_level || "Entry Level"}
            </div>
            {/* <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              1+ years exp
            </div> */}
          </div>
          
          {/* <div className="text-sm text-muted-foreground mb-4">
            {Math.floor(Math.random() * 200) + 50} applicants
          </div> */}
          
          <div className="flex items-center gap-3">
            <button 
              className="p-2 text-muted-foreground hover:text-foreground"
              onClick={() => onExternal?.(job.id)}
              title="Save for later"
            >
              <Bookmark className={`w-5 h-5 ${isExternal ? 'fill-current text-blue-500' : ''}`} />
            </button>
            <button 
              className={`p-2 hover:text-red-500 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={() => onLike?.(job.id)}
              title={isLiked ? "Unlike job" : "Like job"}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <Button variant="outline" className="text-sm">
              ⭐ ASK ORION
            </Button>
            <Button 
              className={`px-6 hover:bg-primary/90 ${isApplied ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground'}`}
              onClick={() => onApply?.(job.id, job.job_url)}
              disabled={isApplied}
            >
              {isApplied ? "APPLIED" : "APPLY NOW"}
            </Button>
          </div>
        </div>
        
        {/* Match Score */}
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 mb-2">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - actualMatchScore / 100)}`}
              className={getMatchColor(actualMatchScore)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-card-foreground">
              {actualMatchScore}%
            </span>
          </div>
        </div>
        <div className="text-center">
          <div className={`text-sm font-semibold ${getMatchColor(actualMatchScore)}`}>
            {getMatchLabel(actualMatchScore)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {job.matchReason ? (
              job.matchReason.length > 40 ? 
                `${job.matchReason.substring(0, 40)}...` : 
                job.matchReason
            ) : (
              <>✓ Growth Opportunities<br />✓ H1B Sponsor Likely</>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function JobrightListing({ jobs, onLoadMore, hasMoreJobs, isLoading, userPreferences, isAutoLoaded }: JobListingPageProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'liked' | 'applied' | 'external'>('jobs');
  const [likedJobs, setLikedJobs] = useState<Set<number>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [externalJobs, setExternalJobs] = useState<Set<number>>(new Set());
  const [userEmail] = useState<string>("user@example.com"); // TODO: Get from authentication
  const [interactionsLoaded, setInteractionsLoaded] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [currentUserPreferences, setCurrentUserPreferences] = useState(userPreferences);

  // Load existing job interactions when component mounts or jobs change
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
        // Continue with empty sets if loading fails
        setInteractionsLoaded(true);
      }
    };

    loadInteractions();
  }, [jobs, userEmail, interactionsLoaded]);
  
  // Filter states
  const [filters, setFilters] = useState({
    workType: [] as string[], // Remote, Onsite, Hybrid
    jobLevel: [] as string[], // Entry Level, Mid Level, Senior Level
    jobType: [] as string[], // Full-time, Part-time, Contract
    datePosted: '' as string, // Last 24 hours, Last week, Last month
    minMatchScore: 0 as number // Minimum match score
  });

  // Apply filters to jobs
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

  // Filter jobs based on active tab
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
    }

    return applyFilters(tabFilteredJobs);
  };

  const filteredJobs = getFilteredJobs();

  // Handle filter changes
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

  // Handle job actions with database persistence
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
    
    try {
      await JobInteractionsService.markJobAsApplied(userEmail, jobId);
      setAppliedJobs(prev => new Set([...prev, jobId]));
      toast.success(`Applied to ${job?.title || 'job'}${jobUrl ? ' - Opening application page' : ''}`);
      
      if (jobUrl) {
        setTimeout(() => {
          window.open(jobUrl, '_blank');
        }, 500);
      }
    } catch (error) {
      console.error('Failed to mark job as applied:', error);
      toast.error("Failed to mark job as applied");
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

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Job Platform Navigation */}
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <nav className="flex items-center gap-6 mb-4">
            <button 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'jobs' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveTab('jobs')}
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
              onClick={() => setActiveTab('liked')}
            >
              Liked <Badge variant="secondary" className="ml-1">{likedJobs.size}</Badge>
            </button>
            <button 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === 'applied' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveTab('applied')}
            >
              Applied <Badge variant="secondary" className="ml-1">{appliedJobs.size}</Badge>
            </button>
            <button 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === 'external' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveTab('external')}
            >
              External <Badge variant="secondary" className="ml-1">{externalJobs.size}</Badge>
            </button>
          </nav>

          {/* Filters */}
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
            
            <div className="flex items-center justify-between">
              {/* Dropdown Filters */}
              <FilterDropdowns
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAllFilters={clearAllFilters}
                getActiveFilterCount={getActiveFilterCount}
              />
            </div>
          </div>
        </div>

        {/* Welcome Back Banner for Auto-loaded Sessions */}
        {isAutoLoaded && currentUserPreferences && (
          <WelcomeBackBanner 
            preferences={currentUserPreferences}
            jobCount={jobs.length}
            onUpdatePreferences={() => setShowPreferencesModal(true)}
          />
        )}

        {/* Job Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              {filteredJobs.length} {activeTab === 'jobs' ? 'results' : activeTab}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Recommended</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground text-right">
            Welcome back!<br />
            Let's continue your job search journey.
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job}
                isLiked={likedJobs.has(job.id)}
                isApplied={appliedJobs.has(job.id)}
                isExternal={externalJobs.has(job.id)}
                onLike={handleLikeJob}
                onApply={handleApplyJob}
                onExternal={handleExternalJob}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {activeTab === 'liked' && "No liked jobs yet. Like jobs to see them here."}
                {activeTab === 'applied' && "No applied jobs yet. Apply to jobs to track them here."}
                {activeTab === 'external' && "No saved jobs yet. Save jobs for later viewing."}
                {activeTab === 'jobs' && "No jobs found."}
              </div>
            </div>
          )}
        </div>

        {/* Load More - Only show on Jobs tab */}
        {activeTab === 'jobs' && (
          <div className="text-center mt-8">
            {hasMoreJobs ? (
              <Button 
                variant="outline" 
                onClick={onLoadMore}
                disabled={isLoading}
                className="px-8 py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Loading More Jobs...
                  </>
                ) : (
                  "Load More Jobs"
                )}
              </Button>
            ) : (
              <div className="text-sm text-muted-foreground">
                {jobs.length > 0 ? "No more jobs available" : ""}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Sidebar - AI Assistant */}
      <div className="w-80 space-y-4">
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-card-foreground">Orion AI Assistant</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3 text-sm">
              <h4 className="font-medium text-card-foreground">Tasks I can assist you with:</h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>🎯</span>
                    <span>Adjust current preference</span>
                  </div>
                  <div className="ml-6 text-xs text-muted-foreground mt-1">
                    Fine-tune your job search criteria
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>⭐</span>
                    <span>Top Match jobs</span>
                  </div>
                  <div className="ml-6 text-xs text-muted-foreground mt-1">
                    Explore jobs where you shine as a top candidate
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>💬</span>
                    <span>Ask Orion</span>
                  </div>
                  <div className="ml-6 text-xs text-muted-foreground mt-1">
                    Get detailed insights on specific jobs
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground mb-3">Ask me anything...</div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your question..."
                  className="flex-1 text-sm px-3 py-2 border border-border rounded-md bg-background"
                />
                <Button size="sm" className="px-3">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Update Modal */}
      {currentUserPreferences && (
        <PreferencesUpdateModal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          currentPreferences={currentUserPreferences}
          userEmail={userEmail}
          onPreferencesUpdated={(newPreferences) => {
            setCurrentUserPreferences(newPreferences);
            // TODO: Optionally refresh jobs with new preferences
            console.log("Preferences updated:", newPreferences);
          }}
        />
      )}
    </div>
  );
} 