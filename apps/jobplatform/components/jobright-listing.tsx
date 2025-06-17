"use client";

import { useState } from "react";
import { ScrapedJob } from "../types/job-types";
import { MapPin, Clock, Building2, Briefcase, Filter, ChevronDown, MoreHorizontal, Heart, Bookmark, Calendar, MessageSquare, X } from "lucide-react";
import { Button } from "@resume/ui/button";
import { Badge } from "@resume/ui/badge";
import { toast } from "@resume/ui/sonner";

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
  
  const timeAgo = job.date_posted 
    ? Math.floor((Date.now() - new Date(job.date_posted).getTime()) / (1000 * 60 * 60))
    : Math.floor(Math.random() * 24) + 1;

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
            {timeAgo} hours ago
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

export function JobrightListing({ jobs, onLoadMore, hasMoreJobs, isLoading, userPreferences }: JobListingPageProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'liked' | 'applied' | 'external'>('jobs');
  const [likedJobs, setLikedJobs] = useState<Set<number>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [externalJobs, setExternalJobs] = useState<Set<number>>(new Set());
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
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

  // Handle job actions
  const handleLikeJob = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    setLikedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
        toast.success(`Removed ${job?.title || 'job'} from liked jobs`);
      } else {
        newSet.add(jobId);
        toast.success(`Added ${job?.title || 'job'} to liked jobs`);
      }
      return newSet;
    });
  };

  const handleApplyJob = (jobId: number, jobUrl?: string) => {
    const job = jobs.find(j => j.id === jobId);
    setAppliedJobs(prev => new Set([...prev, jobId]));
    toast.success(`Applied to ${job?.title || 'job'}${jobUrl ? ' - Opening application page' : ''}`);
    if (jobUrl) {
      setTimeout(() => {
        window.open(jobUrl, '_blank');
      }, 500);
    }
  };

  const handleExternalJob = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    setExternalJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
        toast.success(`Removed ${job?.title || 'job'} from saved jobs`);
      } else {
        newSet.add(jobId);
        toast.success(`Saved ${job?.title || 'job'} for later`);
      }
      return newSet;
    });
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
              <div className="flex items-center gap-2 text-sm">
                {/* Quick Filter Chips */}
                {['Remote', 'Onsite', 'Hybrid'].map(workType => (
                  <button
                    key={workType}
                    onClick={() => handleFilterChange('workType', workType)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      filters.workType.includes(workType)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {workType}
                  </button>
                ))}
                {['Entry Level', 'Mid Level', 'Senior Level'].map(level => (
                  <button
                    key={level}
                    onClick={() => handleFilterChange('jobLevel', level)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      filters.jobLevel.includes(level)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {getActiveFilterCount() > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear ({getActiveFilterCount()})
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'bg-muted' : ''}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Job Type Filter */}
              <div>
                <h4 className="font-medium mb-2 text-card-foreground">Job Type</h4>
                <div className="space-y-2">
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={() => handleFilterChange('jobType', type)}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-card-foreground">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Posted Filter */}
              <div>
                <h4 className="font-medium mb-2 text-card-foreground">Date Posted</h4>
                <div className="space-y-2">
                  {['Last 24 hours', 'Last week', 'Last month', 'Anytime'].map(period => (
                    <label key={period} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="datePosted"
                        checked={filters.datePosted === period || (period === 'Anytime' && !filters.datePosted)}
                        onChange={() => handleFilterChange('datePosted', period === 'Anytime' ? '' : period)}
                        className="border-border"
                      />
                      <span className="text-sm text-card-foreground">{period}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Match Score Filter */}
              <div>
                <h4 className="font-medium mb-2 text-card-foreground">Minimum Match Score</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.minMatchScore}
                    onChange={(e) => handleFilterChange('minMatchScore', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span className="font-medium text-card-foreground">{filters.minMatchScore}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Active Filters Summary */}
              <div>
                <h4 className="font-medium mb-2 text-card-foreground">Active Filters</h4>
                <div className="space-y-1">
                  {getActiveFilterCount() === 0 ? (
                    <span className="text-sm text-muted-foreground">No filters applied</span>
                  ) : (
                    <>
                      {filters.workType.map(type => (
                        <div key={type} className="flex items-center justify-between bg-muted px-2 py-1 rounded text-xs">
                          <span>{type}</span>
                          <button 
                            onClick={() => handleFilterChange('workType', type)}
                            className="text-muted-foreground hover:text-foreground ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {filters.jobLevel.map(level => (
                        <div key={level} className="flex items-center justify-between bg-muted px-2 py-1 rounded text-xs">
                          <span>{level}</span>
                          <button 
                            onClick={() => handleFilterChange('jobLevel', level)}
                            className="text-muted-foreground hover:text-foreground ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {filters.jobType.map(type => (
                        <div key={type} className="flex items-center justify-between bg-muted px-2 py-1 rounded text-xs">
                          <span>{type}</span>
                          <button 
                            onClick={() => handleFilterChange('jobType', type)}
                            className="text-muted-foreground hover:text-foreground ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {filters.datePosted && (
                        <div className="flex items-center justify-between bg-muted px-2 py-1 rounded text-xs">
                          <span>{filters.datePosted}</span>
                          <button 
                            onClick={() => handleFilterChange('datePosted', '')}
                            className="text-muted-foreground hover:text-foreground ml-1"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {filters.minMatchScore > 0 && (
                        <div className="flex items-center justify-between bg-muted px-2 py-1 rounded text-xs">
                          <span>Min {filters.minMatchScore}% match</span>
                          <button 
                            onClick={() => handleFilterChange('minMatchScore', 0)}
                            className="text-muted-foreground hover:text-foreground ml-1"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
} 