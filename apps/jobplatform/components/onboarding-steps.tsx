"use client";

import { useState, useEffect } from "react";
import { Groq } from "groq-sdk";
import { JobPreferencesStep } from "@/components/steps/job-preferences-step";
import { MarketSnapshotStep } from "@/components/steps/market-snapshot-step";
import { ResumeUploadStep } from "@/components/steps/resume-upload-step";
import { StepIndicator } from "@/components/step-indicator";
import { JobCard } from "@/components/job-card";
import { Button } from "@resume/ui/button";
import { toast } from "@resume/ui/sonner";
import { useJobMatching } from "@/hooks/use-job-matching";
import { ScrapedJob, FormData, UserPreferences } from "../types/job-types";

export function OnboardingSteps() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    jobFunction: "",
    jobType: "Full-time",
    location: "USA",
    openToRemote: true,
    workAuthorization: {
      h1bSponsorship: false,
    },
  });
  const [matchedJobs, setMatchedJobs] = useState<ScrapedJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [groqClient, setGroqClient] = useState<Groq | null>(null);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [hasMoreJobs, setHasMoreJobs] = useState(false);

  const { matchJobs, processingBatch, batchProgress } = useJobMatching();

  // Initialize Groq client
  useEffect(() => {
    const initializeGroq = async () => {
      try {
        const client = new Groq({ 
          apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
          dangerouslyAllowBrowser: true
        });
        setGroqClient(client);
        console.log("Groq client initialized successfully");
      } catch (error) {
        console.error("Error initializing Groq client:", error);
        toast.error("Unable to load AI matching service. Please try refreshing the page.");
      }
    };
    
    initializeGroq();
  }, []);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const convertToUserPreferences = (formData: FormData): UserPreferences => ({
    jobFunction: formData.jobFunction,
    jobType: formData.jobType,
    location: formData.location,
    openToRemote: formData.openToRemote,
    needsSponsorship: formData.workAuthorization.h1bSponsorship
  });

  const handleProgressUpdate = (currentMatches: ScrapedJob[]) => {
    setMatchedJobs(currentMatches);
    if (!onboardingComplete) {
      setOnboardingComplete(true);
    }
  };

  const handleComplete = async () => {
    console.log("Form data:", formData);
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/scrape", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const allJobs = await response.json();
      console.log(`Fetched ${allJobs.length} total jobs from API`);
      
      if (!allJobs || allJobs.length === 0) {
        toast.error("No jobs found in the database. Please try again later.");
        return;
      }

      // Process first batch of jobs to show initial results quickly
      const initialBatch = allJobs.slice(0, 15);
      const remainingJobs = allJobs.slice(15);
      
      setHasMoreJobs(remainingJobs.length > 0);

      const userPreferences = convertToUserPreferences(formData);
      const matchedJobsList = await matchJobs(
        initialBatch, 
        userPreferences, 
        groqClient, 
        false, 
        handleProgressUpdate
      );
      
      setMatchedJobs(matchedJobsList);
      setOnboardingComplete(true);
      
      if (matchedJobsList.length > 0) {
        toast.success(`Found ${matchedJobsList.length} initial matches! ${remainingJobs.length > 0 ? 'Click "Load More" for additional results.' : ''}`);
      } else {
        toast.info(`Processing initial ${initialBatch.length} jobs. ${remainingJobs.length > 0 ? 'More jobs available - click "Load More" to see additional results.' : 'No matches found in initial batch.'}`);
      }
      
      if (remainingJobs.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).remainingJobs = remainingJobs;
      }
      
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("There was an error finding matching jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remainingJobs = (window as any).remainingJobs;
    if (!remainingJobs || remainingJobs.length === 0) {
      setHasMoreJobs(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const nextBatch = remainingJobs.slice(0, 15);
      const stillRemaining = remainingJobs.slice(15);
      
      const userPreferences = convertToUserPreferences(formData);
      const newMatches = await matchJobs(nextBatch, userPreferences, groqClient, true);
      
      // Combine with existing matches and sort
      const allMatches = [...matchedJobs, ...newMatches];
      const uniqueMatches = allMatches.filter((job, index, self) => 
        index === self.findIndex(j => j.id === job.id)
      );
      
      setMatchedJobs(uniqueMatches);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).remainingJobs = stillRemaining;
      setHasMoreJobs(stillRemaining.length > 0);
      
      toast.success(`Loaded ${newMatches.length} more matches!`);
      
    } catch (error) {
      console.error("Error loading more jobs:", error);
      toast.error("Error loading more jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    <JobPreferencesStep
      key="job-preferences"
      formData={formData}
      updateFormData={updateFormData}
      onNext={handleNext}
    />,
    <MarketSnapshotStep
      key="market-snapshot"
      jobFunction={formData.jobFunction}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <ResumeUploadStep
      key="resume-upload"
      onComplete={handleComplete}
      onBack={handleBack}
      isLoading={isLoading}
    />,
  ];

  return (
    <div className="space-y-6">
      {onboardingComplete ? (
        <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-card-foreground">
              {showAllJobs ? "All Job Matches" : "Onboarding Complete!"}
            </h2>
            <p className="text-xl text-muted-foreground">
              {matchedJobs.length > 0 
                ? `We've found ${matchedJobs.length} job matches based on your preferences.`
                : "Processing job matches for your preferences..."
              }
              {processingBatch && (
                <span className="block text-sm text-muted-foreground mt-2">
                  Processing batch {batchProgress.current}/{batchProgress.total}...
                </span>
              )}
            </p>
          </div>
          
          {matchedJobs.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {showAllJobs ? `All ${matchedJobs.length} Matches:` : "Top 5 Matches:"}
                </h3>
                {!showAllJobs && matchedJobs.length > 5 && (
                  <Button 
                    variant="outline"
                    onClick={() => setShowAllJobs(true)}
                    className="text-sm"
                  >
                    Show All {matchedJobs.length} Jobs
                  </Button>
                )}
              </div>
              
              <div className="grid gap-4">
                {(showAllJobs ? matchedJobs : matchedJobs.slice(0, 5)).map((job) => (
                  <JobCard key={job.id} job={job} showDescription={showAllJobs} />
                ))}
              </div>
              
              {hasMoreJobs && (
                <div className="text-center mt-6">
                  <Button 
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoading || processingBatch}
                    className="px-6"
                  >
                    {isLoading ? "Loading More..." : "Load More Jobs"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                No matches found yet. {hasMoreJobs ? "Try loading more jobs to find better matches." : ""}
              </p>
              {hasMoreJobs && (
                <Button 
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoading || processingBatch}
                  className="px-6"
                >
                  {isLoading ? "Loading More..." : "Load More Jobs"}
                </Button>
              )}
            </div>
          )}
          
          <div className="mt-8 flex justify-center gap-4">
            {showAllJobs && matchedJobs.length > 0 && (
              <Button 
                variant="outline"
                onClick={() => setShowAllJobs(false)}
                className="rounded-full px-8"
              >
                Back to Summary
              </Button>
            )}
            <Button 
              className="rounded-full bg-primary text-primary-foreground px-8 hover:bg-primary/90"
              onClick={() => {
                if (!showAllJobs && matchedJobs.length > 0) {
                  setShowAllJobs(true);
                } else {
                  toast.info("This would export results or navigate to dashboard in a complete application");
                }
              }}
            >
              {showAllJobs || matchedJobs.length === 0 ? "Export Results" : "View All Matches"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {steps[currentStep]}
          <div className="mt-8 flex justify-center">
            <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
          </div>
        </>
      )}
    </div>
  );
}
