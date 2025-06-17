"use client";

import { useState } from "react";
import { ScrapedJob } from "../types/job-types";
import { Search, MapPin, Clock, Building2, Briefcase, Filter, ChevronDown, MoreHorizontal, Heart, Bookmark, Calendar } from "lucide-react";
import { Button } from "@resume/ui/button";
import { Badge } from "@resume/ui/badge";

interface JobListingPageProps {
  jobs: ScrapedJob[];
  onLoadMore?: () => void;
  hasMoreJobs?: boolean;
  isLoading?: boolean;
}

interface JobCardProps {
  job: ScrapedJob;
  matchScore?: number;
}

const JobCard = ({ job, matchScore = Math.floor(Math.random() * 30) + 70 }: JobCardProps) => {
  const timeAgo = job.date_posted 
    ? Math.floor((Date.now() - new Date(job.date_posted).getTime()) / (1000 * 60 * 60))
    : Math.floor(Math.random() * 24) + 1;

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    return "text-gray-400";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return "STRONG MATCH";
    if (score >= 80) return "GOOD MATCH";
    return "FAIR MATCH";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Calendar className="w-4 h-4" />
            {timeAgo} hours ago
            <button className="ml-auto text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-medium text-gray-700">{job.company}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{job.company_industry || "Software"}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Public Company</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
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
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              1+ years exp
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-4">
            {Math.floor(Math.random() * 200) + 50} applicants
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-500">
              <Heart className="w-5 h-5" />
            </button>
            <Button variant="outline" className="text-sm">
              ⭐ ASK ORION
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6">
              APPLY NOW
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
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - matchScore / 100)}`}
                className={getMatchColor(matchScore)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900">
                {matchScore}%
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-sm font-semibold ${getMatchColor(matchScore)}`}>
              {getMatchLabel(matchScore)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ✓ Growth Opportunities<br />
              ✓ H1B Sponsor Likely
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function JobListingPage({ jobs, onLoadMore, hasMoreJobs, isLoading }: JobListingPageProps) {
  const [selectedFilters, setSelectedFilters] = useState({
    jobType: "Recommended",
    location: "Within US",
    workType: "Full-time",
    level: "Entry Level"
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <h1 className="text-xl font-bold">Jobright</h1>
            </div>
            
            <nav className="flex items-center gap-6">
              <div className="flex items-center gap-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                <Briefcase className="w-4 h-4" />
                JOBS
              </div>
              <button className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm">
                Liked <Badge variant="secondary" className="ml-1">0</Badge>
              </button>
              <button className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm">
                Applied <Badge variant="secondary" className="ml-1">0</Badge>
              </button>
              <button className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm">
                External <Badge variant="secondary" className="ml-1">0</Badge>
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
              🎯 Get Hired Faster with Turbo – Student Discount Available!
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm">O</span>
              </div>
              <div>
                <div className="text-sm font-medium">Orion</div>
                <div className="text-xs text-gray-500">Your AI Copilot</div>
              </div>
              <Button variant="outline" size="sm">Quick Guide</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6">
          <nav className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <span className="font-medium">Jobs</span>
            </div>
            <div className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <span>Resume</span>
              <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
              <span>Profile</span>
            </div>
          </nav>
          
          <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
            <h3 className="font-medium text-emerald-800 mb-2">Refer & Earn</h3>
            <p className="text-sm text-emerald-700 mb-3">
              Invite friends or share on LinkedIn to earn extra rewards!
            </p>
          </div>
          
          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <div>Messages</div>
            <div>Download App</div>
            <div>Feedback</div>
            <div>Setting</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Filters */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Backend Engineer</span>
                <span className="text-sm font-medium">Full Stack Engineer</span>
                <span className="text-sm font-medium">React Developer</span>
                <span className="text-sm text-gray-500">Within US</span>
                <span className="text-sm text-gray-500">Full-time</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Onsite</span>
                <span className="text-sm">Remote</span>
                <span className="text-sm">Hybrid</span>
                <span className="text-sm">Intern/New Grad</span>
                <span className="text-sm">Entry Level</span>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Job Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                {jobs.length} results
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Recommended</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Welcome back, Mukarram Ahmad!<br />
              It's great to see you again. Let's resume your journey towards your dream job.
            </div>
          </div>

          {/* AI Assistant Box */}
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Tasks I can assist you with:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>🎯</span>
                    <span>Adjust current preference</span>
                  </div>
                  <div className="ml-6 text-xs text-gray-500">
                    • Fine-tune your job search criteria.
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <span>Top Match jobs</span>
                  </div>
                  <div className="ml-6 text-xs text-gray-500">
                    • Explore jobs where you shine as a top candidate.
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💬</span>
                    <span>Ask Orion</span>
                  </div>
                  <div className="ml-6 text-xs text-gray-500">
                    • Click on 'Ask Orion' to get detailed insights on specific job.
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-2">Ask me anything...</div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Load More */}
          {hasMoreJobs && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={onLoadMore}
                disabled={isLoading}
                className="px-8"
              >
                {isLoading ? "Loading..." : "Load More Jobs"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 