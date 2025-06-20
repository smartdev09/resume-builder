import { useState, useCallback } from "react";
import { Groq } from "groq-sdk";
import { ScrapedJob, JobMatch, UserPreferences, BatchProgress } from "../types/job-types";
// import { AIMatchingService } from "@/services/ai-matching"; // COMMENTED OUT: AI matching disabled
import { KeywordMatchingService } from "@/services/keyword-matching";
import { toast } from "@resume/ui/sonner";

export const useJobMatching = () => {
  // COMMENTED OUT: AI matching related state variables - only needed for keyword matching now
  // const [processingBatch, setProcessingBatch] = useState(false);
  // const [batchProgress, setBatchProgress] = useState<BatchProgress>({ current: 0, total: 0 });

  // const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // COMMENTED OUT: Not needed for keyword matching

  const matchJobs = useCallback(async (
    jobs: ScrapedJob[], 
    userPreferences: UserPreferences, 
    groqClient: Groq | null,
    isLoadMore = false,
    onProgressUpdate?: (matches: ScrapedJob[]) => void
  ): Promise<ScrapedJob[]> => {
    if (!jobs || jobs.length === 0) return [];

    // TEMPORARILY DISABLED: AI matching is commented out to use only keyword matching
    // Use keyword matching only
    // toast.info("Using advanced keyword matching for job analysis");
    console.log("Jobs before keyword matching:", jobs);
    const keywordMatches = KeywordMatchingService.matchJobs(jobs, userPreferences);
    return keywordMatches.map(match => ({
      ...match.job,
      matchScore: match.score,
      matchReason: match.reason
    }));

    /*
    // COMMENTED OUT: AI MATCHING FUNCTIONALITY
    // If Groq client is not available, use keyword matching
    if (!groqClient) {
      console.log("Groq client not available, using keyword matching");
      toast.info("Using advanced keyword matching for job analysis");
      const keywordMatches = KeywordMatchingService.matchJobs(jobs, userPreferences);
      return keywordMatches.map(match => ({
        ...match.job,
        matchScore: match.score,
        matchReason: match.reason
      }));
    }

    const BATCH_SIZE = 3; // Smaller batches to avoid rate limits
    const allMatches: JobMatch[] = [];
    const totalBatches = Math.ceil(jobs.length / BATCH_SIZE);
    
    setBatchProgress({ current: 0, total: totalBatches });
    setProcessingBatch(true);

    const aiService = new AIMatchingService(groqClient);

    for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
      const batch = jobs.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i/BATCH_SIZE) + 1;
      
      setBatchProgress({ current: batchNumber, total: totalBatches });

      try {
        const batchMatches = await aiService.processBatch(batch, userPreferences);
        allMatches.push(...batchMatches);

        // Show incremental results after each batch for better UX
        if (allMatches.length > 0 && !isLoadMore && onProgressUpdate) {
          const sortedMatches = [...allMatches].sort((a, b) => b.score - a.score);
          const currentMatches = sortedMatches.map(match => ({
            ...match.job,
            matchScore: match.score,
            matchReason: match.reason
          }));
          onProgressUpdate(currentMatches);
        }
      } catch (error) {
        console.error(`Error processing batch ${batchNumber}:`, error);
        
        // If rate limit error, fall back to keyword matching for this batch
        if (error && typeof error === 'object' && 'status' in error && error.status === 429) {
          console.log(`Rate limit hit on batch ${batchNumber}, using keyword matching as fallback`);
          const keywordMatches = KeywordMatchingService.matchJobs(batch, userPreferences);
          allMatches.push(...keywordMatches);
          
          if (!isLoadMore) {
            toast.info(`Batch ${batchNumber}: Using keyword matching due to rate limits`);
          }
        }
        // Continue with next batch instead of failing entirely
      }

      // Longer delay between batches to avoid rate limits
      if (i + BATCH_SIZE < jobs.length) {
        await sleep(5000); // Increased to 5 seconds to respect rate limits
      }
    }

    setProcessingBatch(false);
    
    // Sort by score and return all matches (not just top matches)
    allMatches.sort((a, b) => b.score - a.score);
    
    console.log(`Job matching found ${allMatches.length} matches out of ${jobs.length} jobs`);
    console.log("Top matches:", allMatches.slice(0, 5).map(m => ({ 
      title: m.job.title, 
      score: m.score, 
      reason: m.reason 
    })));

    // Add match scores and reasons to the job objects
    return allMatches.map(match => ({
      ...match.job,
      matchScore: match.score,
      matchReason: match.reason
    }));
    */
  }, []);

  return {
    matchJobs,
    // COMMENTED OUT: AI matching related return values - not needed for keyword matching
    processingBatch: false, // Always false since we're using keyword matching only
    batchProgress: { current: 0, total: 0 } // Always empty since we're using keyword matching only
  };
};