"use client";

import { ScrapedJob } from "../../types/job-types";
import { MapPin, Clock, Building2, Briefcase, Calendar, DollarSign, Users, Globe } from "lucide-react";
import { Badge } from "@resume/ui/badge";
import { formatTimeAgoWithTooltip } from "../../lib/time-utils";

interface JobDetailsInfoProps {
  job: ScrapedJob;
}

export function JobDetailsInfo({ job }: JobDetailsInfoProps) {
  const { timeAgo, exactDate } = formatTimeAgoWithTooltip(job.date_posted);

  const formatSalary = () => {
    if (job.min_amount && job.max_amount) {
      const currency = job.currency || 'USD';
      const interval = job.interval || 'year';
      return `$${job.min_amount.toLocaleString()} - $${job.max_amount.toLocaleString()} ${currency}/${interval}`;
    }
    return null;
  };

  const infoItems = [
    {
      icon: MapPin,
      label: "Location",
      value: job.location,
      color: "text-blue-500"
    },
    {
      icon: Clock,
      label: "Job Type",
      value: job.job_type || "Full-time",
      color: "text-green-500"
    },
    {
      icon: Building2,
      label: "Work Mode",
      value: job.is_remote ? "Remote" : (job.work_from_home_type === 'hybrid' ? "Hybrid" : "Onsite"),
      color: "text-purple-500"
    },
    {
      icon: Briefcase,
      label: "Experience Level",
      value: job.job_level || "Entry Level",
      color: "text-orange-500"
    },
    {
      icon: Calendar,
      label: "Posted",
      value: timeAgo,
      tooltip: exactDate,
      color: "text-gray-500"
    },
    {
      icon: Globe,
      label: "Function",
      value: job.job_function || "Software Engineering",
      color: "text-indigo-500"
    }
  ];

  // Add salary if available
  const salaryInfo = formatSalary();
  if (salaryInfo) {
    infoItems.push({
      icon: DollarSign,
      label: "Salary",
      value: salaryInfo,
      color: "text-emerald-500"
    });
  }

  // Add company size if available
  if (job.company_num_employees) {
    infoItems.push({
      icon: Users,
      label: "Company Size",
      value: job.company_num_employees,
      color: "text-cyan-500"
    });
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">Job Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
            <div className={`${item.color} bg-white/10 rounded-lg p-2`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {item.label}
              </p>
              <p 
                className="text-sm font-medium text-card-foreground truncate"
                title={item.tooltip || item.value}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Skills and Additional Info */}
      {(job.skills || job.experience_range) && (
        <div className="space-y-3">
          {job.skills && (
            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills.split(',').map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {job.experience_range && (
            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">Experience Required</h4>
              <Badge variant="outline" className="text-xs">
                {job.experience_range}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Company Additional Info */}
      {(job.company_revenue || job.company_rating) && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-card-foreground mb-3">Company Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.company_revenue && (
              <div className="text-sm">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="ml-2 font-medium text-card-foreground">{job.company_revenue}</span>
              </div>
            )}
            {job.company_rating && (
              <div className="text-sm">
                <span className="text-muted-foreground">Company Rating:</span>
                <span className="ml-2 font-medium text-card-foreground">
                  {job.company_rating}/5
                  {job.company_reviews_count && (
                    <span className="text-muted-foreground ml-1">
                      ({job.company_reviews_count} reviews)
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 