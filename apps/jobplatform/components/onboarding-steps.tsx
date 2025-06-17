"use client";

import { useState, useEffect } from "react";
import { Groq } from "groq-sdk";
import { JobPreferencesStep } from "@/components/steps/job-preferences-step";
import { MarketSnapshotStep } from "@/components/steps/market-snapshot-step";
import { ResumeUploadStep } from "@/components/steps/resume-upload-step";
import { StepIndicator } from "@/components/step-indicator";
import { JobCard } from "@/components/job-card";
import { JobrightListing } from "@/components/jobright-listing";
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
        toast.warning("AI matching service unavailable. Will use keyword-based matching instead.");
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

      const userPreferences = convertToUserPreferences(formData);
      let matchedJobsList: ScrapedJob[] = [];
      let processedCount = 0;
      const TARGET_INITIAL_JOBS = 10;
      const DISPLAY_THRESHOLD = 5; // Show UI when 5 jobs are found
      const BATCH_SIZE = 25; // Larger batch for better location matching
      let hasDisplayedUI = false;
      
      while (matchedJobsList.length < TARGET_INITIAL_JOBS && processedCount < allJobs.length) {
        const currentBatch = allJobs.slice(processedCount, processedCount + BATCH_SIZE);
        
        if (currentBatch.length === 0) break;
        
        console.log(`Processing batch ${Math.floor(processedCount/BATCH_SIZE) + 1}: ${currentBatch.length} jobs for ${userPreferences.location}`);
        
        try {
          const batchMatches = await matchJobs(
            currentBatch, 
            userPreferences, 
            groqClient, 
            false, 
            (currentMatches) => {
              // Update UI with current matches as they come in
              if (currentMatches.length >= DISPLAY_THRESHOLD && !hasDisplayedUI) {
                setMatchedJobs(currentMatches);
                setOnboardingComplete(true);
                hasDisplayedUI = true;
                toast.success(`Found ${currentMatches.length} matching jobs in ${userPreferences.location}! Loading more...`);
              } else if (hasDisplayedUI && currentMatches.length > matchedJobsList.length) {
                setMatchedJobs(currentMatches);
              }
            }
          );
          
          // Combine matches and remove duplicates
          const combinedMatches = [...matchedJobsList, ...batchMatches];
          matchedJobsList = combinedMatches.filter((job, index, self) => 
            index === self.findIndex(j => j.id === job.id)
          );
        } catch (error) {
          console.error(`Error processing batch ${Math.floor(processedCount/BATCH_SIZE) + 1}:`, error);
          
          // If we hit rate limits, show a helpful message and continue with what we have
          if (error && typeof error === 'object' && 'message' in error && 
              (error as any).message?.includes('Rate limit')) {
            toast.warning(`Rate limit reached. Showing results found so far. You can click "Load More" to continue.`);
            break; // Exit the loop and show current results
          }
                 }
        
        processedCount += BATCH_SIZE;
        
        // If we have enough matches, break early
        if (matchedJobsList.length >= TARGET_INITIAL_JOBS) {
          break;
        }
      }
      
      // Sort by match score
      matchedJobsList.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      // Take top 10 for initial display
      const initialMatches = matchedJobsList.slice(0, TARGET_INITIAL_JOBS);
      const remainingMatches = matchedJobsList.slice(TARGET_INITIAL_JOBS);
      const unprocessedJobs = allJobs.slice(processedCount);
      
      setMatchedJobs(initialMatches);
      setOnboardingComplete(true);
      
      // Determine if there are more jobs available
      const hasMore = remainingMatches.length > 0 || unprocessedJobs.length > 0;
      setHasMoreJobs(hasMore);
      
      // Store remaining data for load more functionality
      if (hasMore) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).remainingMatches = remainingMatches;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).remainingJobs = unprocessedJobs;
        console.log(`Stored ${remainingMatches.length} remaining matches and ${unprocessedJobs.length} unprocessed jobs`);
      }
      
      toast.success(`Found ${initialMatches.length} ${userPreferences.jobFunction} jobs in ${userPreferences.location}! ${hasMore ? 'Click "Load More" for additional results.' : ''}`);
      
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("There was an error finding matching jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remainingMatches = (window as any).remainingMatches || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remainingJobs = (window as any).remainingJobs || [];
    
    console.log(`Load More clicked: ${remainingMatches.length} remaining matches, ${remainingJobs.length} remaining jobs`);
    
    if (remainingMatches.length === 0 && remainingJobs.length === 0) {
      toast.info("No more jobs available to load.");
      setHasMoreJobs(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      let newMatches: ScrapedJob[] = [];
      
      // First, add any already matched jobs that weren't shown initially
      if (remainingMatches.length > 0) {
        const nextMatches = remainingMatches.slice(0, 10);
        const stillRemainingMatches = remainingMatches.slice(10);
        
        newMatches = nextMatches;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).remainingMatches = stillRemainingMatches;
        
        console.log(`Loading ${nextMatches.length} pre-matched jobs, ${stillRemainingMatches.length} still remaining`);
        
      } else if (remainingJobs.length > 0) {
        // If no pre-matched jobs, process more from unprocessed jobs
        const nextBatch = remainingJobs.slice(0, 25);
        const stillRemaining = remainingJobs.slice(25);
        
        console.log(`Processing ${nextBatch.length} new jobs, ${stillRemaining.length} still unprocessed`);
        
        const userPreferences = convertToUserPreferences(formData);
        const batchMatches = await matchJobs(nextBatch, userPreferences, groqClient, true);
        
        // Take up to 10 new matches
        newMatches = batchMatches.slice(0, 10);
        const extraMatches = batchMatches.slice(10);
        
        // Update remaining data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).remainingJobs = stillRemaining;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).remainingMatches = extraMatches;
        
        console.log(`Found ${batchMatches.length} total matches, showing ${newMatches.length}, storing ${extraMatches.length} extra`);
      }
      
      if (newMatches.length > 0) {
        // Combine with existing matches and remove duplicates
        const allMatches = [...matchedJobs, ...newMatches];
        const uniqueMatches = allMatches.filter((job, index, self) => 
          index === self.findIndex(j => j.id === job.id)
        );
        
        setMatchedJobs(uniqueMatches);
        toast.success(`Loaded ${newMatches.length} more job matches!`);
      }
      
      // Check if there are still more jobs to load
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stillHasMatches = ((window as any).remainingMatches || []).length > 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stillHasJobs = ((window as any).remainingJobs || []).length > 0;
      const stillHasMore = stillHasMatches || stillHasJobs;
      
      setHasMoreJobs(stillHasMore);
      
      console.log(`After load more: ${stillHasMatches} remaining matches, ${stillHasJobs} remaining jobs, hasMore: ${stillHasMore}`);
      
      if (newMatches.length === 0 && !stillHasMore) {
        toast.info("No more matching jobs found.");
        setHasMoreJobs(false);
      }
      
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
        <JobrightListing 
          jobs={matchedJobs}
          onLoadMore={handleLoadMore}
          hasMoreJobs={hasMoreJobs}
          isLoading={isLoading || processingBatch}
          userPreferences={convertToUserPreferences(formData)}
        />
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
