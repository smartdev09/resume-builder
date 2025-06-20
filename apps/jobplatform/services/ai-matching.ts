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
    return `You are an expert job matching AI. The user is specifically seeking a "${userPreferences.jobFunction}" role in "${userPreferences.location}".

CRITICAL MATCHING RULES:
1. Job function/title MUST be closely related to "${userPreferences.jobFunction}"
2. Location MUST align with user preferences: "${userPreferences.location}" ${userPreferences.openToRemote ? '(Remote work preferred)' : '(Onsite preferred)'}
3. Prioritize EXACT matches for both job function AND location/remote preference
4. If job function doesn't match closely, score should be below 60
5. If location doesn't match and remote isn't available, reduce score significantly

USER PREFERENCES (ALL MUST BE CONSIDERED):
- Job Function: ${userPreferences.jobFunction} (HIGH PRIORITY - must match closely)
- Job Type: ${userPreferences.jobType} (Required: ${userPreferences.jobType})
- Location: ${userPreferences.location} (CRITICAL - must match or have remote option)
- Open to Remote: ${userPreferences.openToRemote ? 'Yes - Remote work strongly preferred' : 'No - Must be in specified location'}
- Needs Visa Sponsorship: ${userPreferences.needsSponsorship ? 'Yes - H1B sponsorship required' : 'No - No sponsorship needed'}

JOBS TO ANALYZE:
${JSON.stringify(jobsForAnalysis)}

SCORING CRITERIA (0-100 points):
1. Job Function Match (60 points):
   - Exact match: 60 points
   - Close match: 45-55 points
   - Related but different: 25-40 points
   - Unrelated: 0-20 points

2. Location/Remote Alignment (25 points - CRITICAL):
   - Remote available when user wants remote: 25 points
   - Exact location match: 25 points
   - Same state/region: 15-20 points
   - Different location but remote available: 20 points
   - Different location, no remote: 0-5 points

3. Job Type Match (10 points):
   - Exact match to "${userPreferences.jobType}": 10 points
   - Compatible type: 5-8 points
   - Different type: 0-4 points

4. Sponsorship Alignment (5 points):
   - Matches user's sponsorship needs: 5 points
   - Unknown/not specified: 2 points
   - Doesn't match needs: 0 points

MINIMUM SCORE: Only return jobs scoring 70+ points (ensures quality matches)
LOCATION PRIORITY: Jobs must either be in "${userPreferences.location}" OR offer remote work if user is open to remote

REASON FORMAT: Brief explanation mentioning job function, location/remote status, and other key matches

Return JSON array:
[{"id": 123, "score": 85, "reason": "Backend Developer role, Remote available, Full-time position"}]

CRITICAL: Your response must be ONLY a valid JSON array. No additional text, explanations, or formatting.

Example response:
[
  {"id": 1, "score": 85, "reason": "Full-stack role, exact location match"},
  {"id": 2, "score": 78, "reason": "Backend position, remote available"}
]

Begin your response with [ and end with ]`;
  }

  async processBatch(
    batch: ScrapedJob[], 
    userPreferences: UserPreferences, 
    maxRetries: number = 2
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
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are a precise job matching AI. CRITICAL: You must respond ONLY with a valid JSON array. Do not include any explanatory text, markdown formatting, or other content. Focus heavily on job function relevance. Return only a JSON array format: [{'id': number, 'score': number, 'reason': 'brief explanation'}] for jobs that closely match the requested job function."
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

        let cleanedResponse = "";
        try {
          // Clean up the response to ensure it's valid JSON
          cleanedResponse = responseText.trim();
          
          // Remove any markdown formatting
          cleanedResponse = cleanedResponse.replace(/```json/g, '').replace(/```/g, '');
          
          // Find JSON array in the response - be more thorough
          let jsonStart = cleanedResponse.indexOf('[');
          let jsonEnd = cleanedResponse.lastIndexOf(']') + 1;
          
          // If no JSON array found, try to find JSON objects wrapped in array
          if (jsonStart === -1) {
            // Look for individual JSON objects and wrap them in an array
            const objectMatches = cleanedResponse.match(/\{[^}]*\}/g);
            if (objectMatches && objectMatches.length > 0) {
              cleanedResponse = '[' + objectMatches.join(',') + ']';
              jsonStart = 0;
              jsonEnd = cleanedResponse.length;
            }
          }
          
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd);
          } else {
            // If no valid JSON structure found, log the response and continue
            console.error("No valid JSON array found in response:", responseText.substring(0, 200));
            throw new Error("No valid JSON structure found in AI response");
          }

          // Validate that we have a proper JSON string before parsing
          if (!cleanedResponse.startsWith('[') || !cleanedResponse.endsWith(']')) {
            console.error("Cleaned response is not a valid JSON array:", cleanedResponse.substring(0, 100));
            throw new Error("Response is not a valid JSON array");
          }

          const aiMatches: Array<{id: number, score: number, reason: string}> = JSON.parse(cleanedResponse);
          
          // Validate the parsed result
          if (!Array.isArray(aiMatches)) {
            console.error("Parsed result is not an array:", typeof aiMatches);
            throw new Error("Parsed result is not an array");
          }
          
          // Map matches back to full job objects
          aiMatches.forEach(match => {
            // Validate each match object
            if (typeof match === 'object' && match !== null && 
                typeof match.id === 'number' && 
                typeof match.score === 'number' && 
                typeof match.reason === 'string') {
              const job = batch.find(j => j.id === match.id);
              if (job && match.score >= 70) {
                matches.push({
                  job,
                  score: match.score,
                  reason: match.reason
                });
              }
            } else {
              console.warn("Invalid match object:", match);
            }
          });

          batchSuccessful = true;
          break;

        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          console.error("Original response:", responseText.substring(0, 500));
          console.error("Cleaned response:", cleanedResponse?.substring(0, 300));
          retryCount++;
          
          // If it's the last retry, break and use keyword matching
          if (retryCount >= maxRetries) {
            console.log("Max retries reached, will fall back to keyword matching");
            break;
          }
          
          // Add a small delay before retry
          await this.sleep(2000);
        }

      } catch (error: unknown) {
        console.error("Error calling API:", error);
        
        if (typeof error === "object" && error !== null && "status" in error && (error as { status?: number }).status === 429) {
          retryCount++;
          // Exponential backoff with longer waits for rate limits
          const waitTime = Math.min(15000 * Math.pow(2, retryCount - 1), 60000);
          console.log(`Rate limit hit. Waiting ${waitTime/1000}s before retry ${retryCount}/${maxRetries}...`);
          await this.sleep(waitTime);
          continue;
        } else {
          console.error("Non-rate-limit API error:", error);
          retryCount++;
          
          // If it's the last retry, break and use keyword matching
          if (retryCount >= maxRetries) {
            console.log("Max retries reached due to API errors, will fall back to keyword matching");
            break;
          }
          
          // Add a small delay before retry for non-rate-limit errors too
          await this.sleep(3000);
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