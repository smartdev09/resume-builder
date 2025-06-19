"use client";

import { ScrapedJob } from "../../types/job-types";
import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@resume/ui/button";

interface JobDetailsDescriptionProps {
  job: ScrapedJob;
}

export function JobDetailsDescription({ job }: JobDetailsDescriptionProps) {
  const formatDescription = (description: string | null) => {
    if (!description) return null;
    
    // Split by common separators and clean up
    const sections = description
      .split(/\n\n|\n•|\n-|\n\*/)
      .map(section => section.trim())
      .filter(section => section.length > 0);

    return sections;
  };

  const descriptionSections = formatDescription(job.description);

  const fallbackDescription = [
    "We are looking for a talented professional to join our dynamic team.",
    "In this role, you will be responsible for contributing to innovative projects and collaborating with cross-functional teams to deliver high-quality solutions.",
    "The ideal candidate will have strong problem-solving skills, excellent communication abilities, and a passion for continuous learning and growth.",
    "This is an excellent opportunity to advance your career in a supportive and fast-paced environment."
  ];

  const sectionsToDisplay = descriptionSections && descriptionSections.length > 0 
    ? descriptionSections 
    : fallbackDescription;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Job Description
        </h3>
        {job.job_url && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(job.job_url, '_blank')}
            className="text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View Original
          </Button>
        )}
      </div>

      <div className="bg-muted/30 rounded-lg p-6 border border-border">
        <div className="prose prose-sm max-w-none">
          {sectionsToDisplay.map((section, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p className="text-sm text-card-foreground leading-relaxed">
                {section}
              </p>
            </div>
          ))}
        </div>

        {!job.description && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              <FileText className="w-3 h-3 inline mr-1" />
              Full job description not available. Click "View Original" to see complete details on the company's website.
            </p>
          </div>
        )}
      </div>

      {/* Company Description */}
      {job.company_description && (
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-card-foreground">About {job.company}</h4>
          <div className="bg-muted/20 rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {job.company_description}
            </p>
          </div>
        </div>
      )}

      {/* Additional Links */}
      <div className="flex flex-wrap gap-2 pt-2">
        {job.job_url && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(job.job_url, '_blank')}
            className="text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Original Job Posting
          </Button>
        )}
        {job.company_url && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(job.company_url, '_blank')}
            className="text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Company Website
          </Button>
        )}
      </div>
    </div>
  );
} 