import { Groq } from "groq-sdk";
import { ScrapedJob, JobMatch, UserPreferences, JobAnalysis } from "../types/job-types";
import { KeywordMatchingService } from "./keyword-matching";

export class AIMatchingService {
  private groqClient: Groq;

  constructor(groqClient: Groq) {
    this.groqClient = groqClient;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createPrompt(userPreferences: UserPreferences, jobsForAnalysis: JobAnalysis[]): string {
    return `You are an expert job matching AI. The user is specifically seeking a "${userPreferences.jobFunction}" role.

CRITICAL MATCHING RULES:
1. Job function/title MUST be closely related to "${userPreferences.jobFunction}"
2. Prioritize EXACT matches for job function (e.g., DevOps Engineer should NOT match Frontend Engineer)
3. Only return jobs that are relevant to the specific role requested
4. If job function doesn't match closely, score should be below 60

USER PREFERENCES:
- Job Function: ${userPreferences.jobFunction} (HIGH PRIORITY - must match closely)
- Job Type: ${userPreferences.jobType}
- Location: ${userPreferences.location}
- Open to Remote: ${userPreferences.openToRemote ? 'Yes' : 'No'}
- Needs Visa Sponsorship: ${userPreferences.needsSponsorship ? 'Yes' : 'No'}

JOBS TO ANALYZE:
${JSON.stringify(jobsForAnalysis)}

Score each job 0-100 based on:
1. Job function/title relevance (80% weight) - Must be closely related to "${userPreferences.jobFunction}"
2. Job type compatibility (5% weight)
3. Location/remote alignment (10% weight)
4. Overall relevance (5% weight)

Return JSON array with score 0-100, only jobs scoring 70+ for exact function matches:
[{"id": 123, "score": 85, "reason": "Exact DevOps Engineer match, remote available"}]`;
  }

  async processBatch(
    batch: ScrapedJob[], 
    userPreferences: UserPreferences, 
    maxRetries: number = 3
  ): Promise<JobMatch[]> {
    const jobsForAnalysis = batch.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      job_type: job.job_type,
      is_remote: job.is_remote,
      job_function: job.job_function,
      description: job.description ? job.description.substring(0, 300) : null,
      work_from_home_type: job.work_from_home_type
    }));

    const prompt = this.createPrompt(userPreferences, jobsForAnalysis);
    let retryCount = 0;
    let batchSuccessful = false;
    const matches: JobMatch[] = [];

    while (retryCount < maxRetries && !batchSuccessful) {
      try {
        const response = await this.groqClient.chat.completions.create({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "You are a precise job matching AI. Focus heavily on job function relevance. Return only JSON array for jobs that closely match the requested job function."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 800,
          top_p: 1,
          stream: false
        });

        const responseText = response.choices[0]?.message?.content;
        if (!responseText) {
          console.error("No response from model");
          break;
        }

        try {
          // Clean up the response to ensure it's valid JSON
          let cleanedResponse = responseText.trim();
          
          // Remove any markdown formatting
          cleanedResponse = cleanedResponse.replace(/```json/g, '').replace(/```/g, '');
          
          // Find JSON array in the response
          const jsonStart = cleanedResponse.indexOf('[');
          const jsonEnd = cleanedResponse.lastIndexOf(']') + 1;
          
          if (jsonStart !== -1 && jsonEnd !== -1) {
            cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd);
          }

          const aiMatches: Array<{id: number, score: number, reason: string}> = JSON.parse(cleanedResponse);
          
          // Map matches back to full job objects
          aiMatches.forEach(match => {
            const job = batch.find(j => j.id === match.id);
            if (job && match.score >= 70) {
              matches.push({
                job,
                score: match.score,
                reason: match.reason
              });
            }
          });

          batchSuccessful = true;
          break;

        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          break;
        }

      } catch (error: unknown) {
        console.error("Error calling API:", error);
        
        if (typeof error === "object" && error !== null && "status" in error && (error as { status?: number }).status === 429) {
          retryCount++;
          const waitTime = Math.min(5000 * retryCount, 30000);
          console.log(`Rate limit hit. Waiting ${waitTime/1000}s before retry ${retryCount}/${maxRetries}...`);
          await this.sleep(waitTime);
          continue;
        } else {
          break;
        }
      }
    }

    // If AI failed, use keyword matching for this batch
    if (!batchSuccessful) {
      console.log("AI failed for batch, using keyword matching");
      const keywordMatches = KeywordMatchingService.matchJobs(batch, userPreferences);
      matches.push(...keywordMatches);
    }

    return matches;
  }
}