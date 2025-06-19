"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ScrapedJob } from "../../../types/job-types";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@resume/ui/button";
import { toast } from "@resume/ui/sonner";
import { JobDetailsHeader } from "../../../components/job-details/job-details-header";
import { JobDetailsInfo } from "../../../components/job-details/job-details-info";
import { JobDetailsDescription } from "../../../components/job-details/job-details-description";
import { JobDetailsActions } from "../../../components/job-details/job-details-actions";
import { JobInteractionsService } from "../../../services/job-interactions-service";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<ScrapedJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isExternal, setIsExternal] = useState(false);
  const [userEmail] = useState<string>("user@example.com"); // TODO: Get from authentication

  // Load job details and interaction status
  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        // TODO: Replace with actual API call to fetch job by ID
        const response = await fetch(`/api/jobs/${jobId}`);
        if (response.ok) {
          const jobData = await response.json();
          setJob(jobData);
          
          // Load interaction status
          const statusMap = await JobInteractionsService.getJobInteractionStatus(userEmail, [parseInt(jobId)]);
          const interactions = statusMap[jobId] || [];
          setIsLiked(interactions.includes('LIKED'));
          setIsApplied(interactions.includes('APPLIED'));
          setIsExternal(interactions.includes('SAVED_EXTERNAL'));
        } else {
          toast.error("Job not found");
          router.push('/jobs');
        }
      } catch (error) {
        console.error('Failed to load job details:', error);
        toast.error("Failed to load job details");
        router.push('/jobs');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadJobDetails();
    }
  }, [jobId, userEmail, router]);

  // Handle job interactions
  const handleLikeJob = async (jobId: number) => {
    try {
      if (isLiked) {
        await JobInteractionsService.unlikeJob(userEmail, jobId);
        setIsLiked(false);
        toast.success(`Removed ${job?.title || 'job'} from liked jobs`);
      } else {
        await JobInteractionsService.likeJob(userEmail, jobId);
        setIsLiked(true);
        toast.success(`Added ${job?.title || 'job'} to liked jobs`);
      }
    } catch (error) {
      console.error('Failed to update like status:', error);
      toast.error("Failed to update like status");
    }
  };

  const handleApplyJob = async (jobId: number, jobUrl?: string) => {
    try {
      await JobInteractionsService.markJobAsApplied(userEmail, jobId);
      setIsApplied(true);
      toast.success(`Marked ${job?.title || 'job'} as applied`);
      
      if (jobUrl) {
        window.open(jobUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to mark job as applied:', error);
      toast.error("Failed to mark job as applied");
    }
  };

  const handleExternalJob = async (jobId: number) => {
    try {
      if (isExternal) {
        await JobInteractionsService.removeInteraction({
          userEmail,
          jobId,
          interactionType: 'SAVED_EXTERNAL'
        });
        setIsExternal(false);
        toast.success(`Removed ${job?.title || 'job'} from saved jobs`);
      } else {
        await JobInteractionsService.saveJobExternal(userEmail, jobId);
        setIsExternal(true);
        toast.success(`Saved ${job?.title || 'job'} for later`);
      }
    } catch (error) {
      console.error('Failed to update external save status:', error);
      toast.error("Failed to update external save status");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">Job not found</h2>
            <Button onClick={handleGoBack}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleGoBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-lg font-semibold text-card-foreground">Job Details</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Job Details Content */}
          <div className="flex-1">
            <div className="bg-card rounded-lg border border-border shadow-sm">
              <div className="p-6 space-y-6">
                {/* Job Header */}
                <JobDetailsHeader job={job} />

                {/* Job Info Grid */}
                <JobDetailsInfo job={job} />

                {/* Job Description */}
                <JobDetailsDescription job={job} />

                {/* Actions */}
                <JobDetailsActions
                  job={job}
                  isLiked={isLiked}
                  isApplied={isApplied}
                  isExternal={isExternal}
                  onLike={handleLikeJob}
                  onApply={handleApplyJob}
                  onExternal={handleExternalJob}
                  onClose={handleGoBack}
                />
              </div>
            </div>
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
                        <span>Analyze job match</span>
                      </div>
                      <div className="ml-6 text-xs text-muted-foreground mt-1">
                        Get detailed insights on why this job matches your profile
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>📝</span>
                        <span>Tailor resume</span>
                      </div>
                      <div className="ml-6 text-xs text-muted-foreground mt-1">
                        Customize your resume for this specific position
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>💬</span>
                        <span>Interview prep</span>
                      </div>
                      <div className="ml-6 text-xs text-muted-foreground mt-1">
                        Practice questions based on job requirements
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>📊</span>
                        <span>Salary insights</span>
                      </div>
                      <div className="ml-6 text-xs text-muted-foreground mt-1">
                        Market data and negotiation tips for this role
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-3">Ask me anything about this job...</div>
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
      </div>
    </div>
  );
} 