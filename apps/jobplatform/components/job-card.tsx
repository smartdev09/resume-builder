"use client";

import { ScrapedJob } from "../types/job-types";
import { MapPin, Clock, Building2, Briefcase, Calendar, MoreHorizontal, Heart, Bookmark } from "lucide-react";
import { Button } from "@resume/ui/button";
import { formatTimeAgoWithTooltip } from "../lib/time-utils";

interface JobCardProps {
  job: ScrapedJob;
  matchScore?: number;
  isLiked?: boolean;
  isApplied?: boolean;
  isExternal?: boolean;
  onLike?: (jobId: number) => void;
  onApply?: (jobId: number, jobUrl?: string) => void;
  onExternal?: (jobId: number) => void;
  onJobClick?: (job: ScrapedJob) => void;
}

export function JobCard({ 
  job, 
  matchScore, 
  isLiked, 
  isApplied, 
  isExternal, 
  onLike, 
  onApply, 
  onExternal, 
  onJobClick 
}: JobCardProps) {
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
        <div 
          className="flex-1 pr-6 cursor-pointer" 
          onClick={() => onJobClick?.(job)}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span title={exactDate}>{timeAgo}</span>
            <button 
              className="ml-auto text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
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
          </div>
          
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => onExternal?.(job.id)}
              title="Save for later"
              className={isExternal ? 'text-blue-500' : ''}
            >
              <Bookmark className={`w-5 h-5 ${isExternal ? 'fill-current' : ''}`} />
            </Button>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => onLike?.(job.id)}
              title={isLiked ? "Unlike job" : "Like job"}
              className={isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="outline" className="text-sm">
              ⭐ ASK ORION
            </Button>
            <Button 
              className={`px-6 ${isApplied ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
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
}