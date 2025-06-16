import { useState, useCallback } from "react";
import { Groq } from "groq-sdk";
import { ScrapedJob, JobMatch, UserPreferences, BatchProgress } from "../types/job-types";
import { AIMatchingService } from "@/services/ai-matching";
import { KeywordMatchingService } from "@/services/keyword-matching";
import { toast } from "@resume/ui/sonner";

export const useJobMatching = () => {
  const [processingBatch, setProcessingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState<BatchProgress>({ current: 0, total: 0 });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const matchJobs = useCallback(async (
    jobs: ScrapedJob[], 
    userPreferences: UserPreferences, 
    groqClient: Groq | null,
    isLoadMore = false,
    onProgressUpdate?: (matches: ScrapedJob[]) => void
  ): Promise<ScrapedJob[]> => {
    if (!jobs || jobs.length === 0) return [];

    // If Groq client is not available, use keyword matching
    if (!groqClient) {
      console.log("Groq client not available, using keyword matching");
      toast.info("Using advanced keyword matching for job analysis");
      const keywordMatches = KeywordMatchingService.matchJobs(jobs, userPreferences);
      return keywordMatches.map(match => match.job);
    }

    const BATCH_SIZE = 3;
    const allMatches: JobMatch[] = [];
    const totalBatches = Math.ceil(jobs.length / BATCH_SIZE);
    
    setBatchProgress({ current: 0, total: totalBatches });
    setProcessingBatch(true);

    const aiService = new AIMatchingService(groqClient);

    for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
      const batch = jobs.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i/BATCH_SIZE) + 1;
      
      setBatchProgress({ current: batchNumber, total: totalBatches });
      
      if (!isLoadMore) {
        toast.info(`AI analyzing jobs batch ${batchNumber}/${totalBatches}...`);
      }

      const batchMatches = await aiService.processBatch(batch, userPreferences);
      allMatches.push(...batchMatches);

      // Show incremental results after each batch
      if (allMatches.length > 0 && !isLoadMore && onProgressUpdate) {
        allMatches.sort((a, b) => b.score - a.score);
        const currentMatches = allMatches.map(match => match.job);
        onProgressUpdate(currentMatches);
      }

      // Delay between batches to avoid rate limits
      if (i + BATCH_SIZE < jobs.length) {
        await sleep(3000);
      }
    }

    setProcessingBatch(false);
    
    // Sort by score and return top matches
    allMatches.sort((a, b) => b.score - a.score);
    
    console.log(`Job matching found ${allMatches.length} matches out of ${jobs.length} jobs`);
    console.log("Top matches:", allMatches.slice(0, 5).map(m => ({ 
      title: m.job.title, 
      score: m.score, 
      reason: m.reason 
    })));

    return allMatches.map(match => match.job);
  }, []);

  return {
    matchJobs,
    processingBatch,
    batchProgress
  };
};