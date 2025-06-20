"use client";

import { ScrapedJob } from "../../types/job-types";
import { Badge } from "@resume/ui/badge";
import { Building2, Star } from "lucide-react";

interface JobDetailsHeaderProps {
  job: ScrapedJob;
}

export function JobDetailsHeader({ job }: JobDetailsHeaderProps) {
  const actualMatchScore = job.matchScore || Math.floor(Math.random() * 30) + 70;

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

  const getMatchBadgeColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (score >= 80) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    if (score >= 70) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-4">
      {/* Company Logo and Name */}
      <div className="flex items-center gap-3">
        {job.company_logo ? (
          <img 
            src={job.company_logo} 
            alt={`${job.company} logo`}
            className="w-12 h-12 rounded-lg object-contain border border-border"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border border-border">
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">{job.company}</h3>
          <p className="text-sm text-muted-foreground">
            {job.company_industry || "Software"} • Public Company
          </p>
        </div>
      </div>

      {/* Job Title and Match Score */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-card-foreground mb-2">{job.title}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant="secondary" 
              className={`${getMatchBadgeColor(actualMatchScore)} font-medium`}
            >
              <Star className="w-3 h-3 mr-1" />
              {actualMatchScore}% MATCH
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getMatchLabel(actualMatchScore)}
            </Badge>
            {job.matchReason && (
              <span className="text-xs text-muted-foreground">
                {job.matchReason}
              </span>
            )}
          </div>
        </div>

        {/* Match Score Circle */}
        <div className="flex flex-col items-center ml-6">
          <div className="relative w-20 h-20">
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
              <span className="text-lg font-bold text-card-foreground">
                {actualMatchScore}%
              </span>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className={`text-xs font-semibold ${getMatchColor(actualMatchScore)}`}>
              {getMatchLabel(actualMatchScore)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 