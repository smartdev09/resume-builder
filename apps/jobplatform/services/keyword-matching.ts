import { ScrapedJob, JobMatch, UserPreferences } from "../types/job-types";
import { jobFunctionKeywords } from "@/config/job-keywords";

export class KeywordMatchingService {
  static calculateJobMatch(job: ScrapedJob, userPreferences: UserPreferences): JobMatch | null {
    let score = 0;
    const reasons: string[] = [];

    const userFunctionKeywords = jobFunctionKeywords[userPreferences.jobFunction as keyof typeof jobFunctionKeywords] || 
                                [userPreferences.jobFunction.toLowerCase()];

    // Job Function Matching (80% weight - 80 points max)
    if (userPreferences.jobFunction && (job.job_function || job.title)) {
      const jobFunction = job.job_function?.toLowerCase() || '';
      const jobTitle = job.title?.toLowerCase() || '';
      const jobDescription = job.description?.toLowerCase() || '';
      const userFunction = userPreferences.jobFunction.toLowerCase();
      
      // Check for exact matches first
      if (jobFunction.includes(userFunction) || jobTitle.includes(userFunction)) {
        score += 80;
        reasons.push("Exact job function match");
      } else {
        // Use keyword mapping for better matching
        let keywordMatches = 0;
        let exactKeywordMatches = 0;
        
        userFunctionKeywords.forEach(keyword => {
          if (jobTitle.includes(keyword) || jobFunction.includes(keyword)) {
            keywordMatches++;
            if (jobTitle.includes(keyword.toLowerCase()) || jobFunction.includes(keyword.toLowerCase())) {
              exactKeywordMatches++;
            }
          }
          // Also check description for additional context
          if (jobDescription.includes(keyword)) {
            keywordMatches += 0.5; // Lower weight for description matches
          }
        });
        
        // Calculate match strength
        const matchStrength = keywordMatches / userFunctionKeywords.length;
        
        if (matchStrength >= 0.8) {
          score += 75;
          reasons.push("High relevance keyword match");
        } else if (matchStrength >= 0.6) {
          score += 65;
          reasons.push("Good keyword match");
        } else if (matchStrength >= 0.4) {
          score += 55;
          reasons.push("Moderate keyword match");
        } else if (matchStrength >= 0.2) {
          score += 45;
          reasons.push("Partial keyword match");
        }
        
        // Bonus for exact keyword matches
        score += exactKeywordMatches * 5;
      }
    }

    // Job Type Matching (10 points max)
    if (job.job_type && userPreferences.jobType) {
      const jobType = job.job_type.toLowerCase();
      const userJobType = userPreferences.jobType.toLowerCase();
      
      if (jobType.includes(userJobType) || userJobType.includes(jobType)) {
        score += 10;
        reasons.push("Job type match");
      } else {
        // Partial compatibility check
        if ((userJobType === "full-time" && (jobType.includes("permanent") || jobType.includes("full"))) ||
            (userJobType === "contract" && (jobType.includes("contractor") || jobType.includes("freelance"))) ||
            (userJobType === "part-time" && jobType.includes("part"))) {
          score += 6;
          reasons.push("Compatible job type");
        }
      }
    }

    // Location/Remote Matching (25 points max - increased importance)
    if (userPreferences.openToRemote && job.is_remote) {
      score += 25;
      reasons.push("Remote work available");
    } else if (job.location && userPreferences.location) {
      const jobLocation = job.location.toLowerCase();
      const userLocation = userPreferences.location.toLowerCase();
      
      // Exact location match
      if (jobLocation.includes(userLocation) || userLocation.includes(jobLocation)) {
        score += 25;
        reasons.push("Location match");
      } else {
        // Check for state/country matches
        const locationTerms = userLocation.split(/[\s,]+/);
        let partialMatch = false;
        locationTerms.forEach(term => {
          if (term.length > 2 && jobLocation.includes(term)) {
            score += 15;
            reasons.push("Partial location match");
            partialMatch = true;
          }
        });
        
        // If no location match and user doesn't want remote, penalize heavily
        if (!partialMatch && !userPreferences.openToRemote) {
          score -= 20; // Significant penalty for location mismatch
        }
        
        // If remote is available but user prefers specific location
        if (job.is_remote && !partialMatch) {
          score += 15;
          reasons.push("Remote option available");
        }
      }
    } else if (!job.location && !job.is_remote) {
      // No location info and not remote - penalize
      score -= 10;
    }

    // Sponsorship Alignment (5 points max)
    if (userPreferences.needsSponsorship) {
      // Check if job description mentions sponsorship
      if (job.description && 
          (job.description.toLowerCase().includes("sponsorship") || 
           job.description.toLowerCase().includes("h1b") ||
           job.description.toLowerCase().includes("visa"))) {
        score += 5;
        reasons.push("Sponsorship available");
      } else {
        // Assume large companies more likely to sponsor
        const largeCompanyIndicators = ["google", "microsoft", "amazon", "apple", "facebook", "meta", "netflix"];
        if (job.company && largeCompanyIndicators.some(company => 
          job.company.toLowerCase().includes(company))) {
          score += 3;
          reasons.push("Large company (likely sponsors)");
        } else {
          score += 2; // Neutral assumption
        }
      }
    } else {
      score += 5; // No sponsorship needed - full points
    }

    // Overall Relevance Bonus (5% weight - 5 points max)
    if (job.description && userPreferences.jobFunction) {
      const description = job.description.toLowerCase();
      const relevantKeywords = userFunctionKeywords.filter(keyword => keyword.length > 3);
      let keywordMatches = 0;
      
      relevantKeywords.forEach(keyword => {
        if (description.includes(keyword)) {
          keywordMatches++;
        }
      });
      
      if (keywordMatches > 0) {
        score += Math.min(5, keywordMatches);
        reasons.push("Relevant keywords in description");
      }
    }

    // Only include jobs with score >= 60 for quality control (matches AI threshold)
    if (score >= 60) {
      return {
        job,
        score: Math.min(100, score), // Cap at 100
        reason: reasons.join(", ") || "Keyword-based match"
      };
    }

    return null;
  }

  static matchJobs(jobs: ScrapedJob[], userPreferences: UserPreferences): JobMatch[] {
    const matches: JobMatch[] = [];

    jobs.forEach(job => {
      const match = this.calculateJobMatch(job, userPreferences);
      if (match) {
        matches.push(match);
      }
    });

    // Sort by score
    matches.sort((a, b) => b.score - a.score);
    
    console.log(`Keyword matching found ${matches.length} matches out of ${jobs.length} jobs`);
    console.log("Top keyword matches:", matches.slice(0, 5).map(m => ({ 
      title: m.job.title, 
      score: m.score, 
      reason: m.reason 
    })));

    return matches;
  }
}