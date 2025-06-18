import { ScrapedJob } from "../types/job-types";
import { formatTimeAgo } from "../lib/time-utils";

interface JobCardProps {
  job: ScrapedJob;
  showDescription?: boolean;
}

export const JobCard = ({ job, showDescription = false }: JobCardProps) => (
  <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="flex-1">
        <h4 className="font-semibold text-lg text-card-foreground mb-1">{job.title}</h4>
        <p className="text-muted-foreground text-base font-medium mb-3">{job.company}</p>
        {showDescription && job.description && (
          <p className="text-muted-foreground text-sm mt-2 mb-4 line-clamp-3">
            {job.description.substring(0, 200)}...
          </p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.location && (
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
              📍 {job.location}
            </span>
          )}
          {job.job_type && (
            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
              💼 {job.job_type}
            </span>
          )}
          {job.is_remote && (
            <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
              🏠 Remote
            </span>
          )}
          {job.date_posted && (
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
              📅 {formatTimeAgo(job.date_posted)}
            </span>
          )}
        </div>
        {job.job_url && (
          <div className="mt-3">
            <a 
              href={job.job_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              View Job →
            </a>
          </div>
        )}
      </div>
    </div>
  </div>
);