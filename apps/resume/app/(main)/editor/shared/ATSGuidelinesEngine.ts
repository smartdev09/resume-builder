import { ResumeValues } from "utils/validations";
import { 
  ATSAnalysisResult, 
  ComplianceLevel, 
  SectionAnalysis, 
  ValidationIssue 
} from "./types";
import {
  validateContact,
  validateExperience,
  validateSkills,
  validateEducation,
  validateProjects
} from "./SectionValidators";

export class ATSGuidelinesEngine {
  // Section weights for overall score calculation
  private static readonly SECTION_WEIGHTS: Record<SectionAnalysis['section'], number> = {
    contact: 0.15,     // 15% - Essential contact info
    summary: 0.05,     // 5% - Professional summary
    experience: 0.40,  // 40% - Most important for most roles
    skills: 0.25,      // 25% - Critical for technical roles
    education: 0.10,   // 10% - Important but less weighted
    projects: 0.05     // 5% - Nice to have, shows initiative
  };

  /**
   * Analyzes a complete resume and returns comprehensive ATS analysis
   */
  public static analyzeResume(resumeData: ResumeValues): ATSAnalysisResult {
    const sectionAnalyses: SectionAnalysis[] = [
      validateContact(resumeData),
      validateExperience(resumeData),
      validateSkills(resumeData),
      validateEducation(resumeData),
      validateProjects(resumeData)
    ];

    const overallScore = this.calculateOverallScore(sectionAnalyses);
    const complianceLevel = this.getComplianceLevel(overallScore);
    const criticalIssues = this.extractCriticalIssues(sectionAnalyses);
    const topSuggestions = this.generateTopSuggestions(sectionAnalyses);

    return {
      overallScore,
      complianceLevel,
      sectionAnalyses,
      criticalIssues,
      topSuggestions,
      analysisTimestamp: new Date().toISOString()
    };
  }

  /**
   * Calculates weighted overall score based on section scores
   */
  private static calculateOverallScore(sectionAnalyses: SectionAnalysis[]): number {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    sectionAnalyses.forEach(analysis => {
      const weight = this.SECTION_WEIGHTS[analysis.section];
      if (weight !== undefined) {
        totalWeightedScore += analysis.score * weight;
        totalWeight += weight;
      }
    });

    return Math.round(totalWeightedScore / totalWeight);
  }

  /**
   * Determines compliance level based on overall score
   */
  private static getComplianceLevel(score: number): ComplianceLevel {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  }

  /**
   * Extracts all critical and high severity issues
   */
  private static extractCriticalIssues(sectionAnalyses: SectionAnalysis[]): ValidationIssue[] {
    const criticalIssues: ValidationIssue[] = [];
    
    sectionAnalyses.forEach(analysis => {
      const severityOrder = ['critical', 'high', 'medium', 'low'];
      const sortedIssues = analysis.issues.sort((a, b) => 
        severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
      );
      
      // Take critical and high severity issues
      criticalIssues.push(
        ...sortedIssues.filter(issue => 
          issue.severity === 'critical' || issue.severity === 'high'
        )
      );
    });

    return criticalIssues;
  }

  /**
   * Generates prioritized list of top suggestions
   */
  private static generateTopSuggestions(sectionAnalyses: SectionAnalysis[]): string[] {
    const suggestions = new Set<string>();

    // Add suggestions from sections with lowest scores first
    const sortedByScore = [...sectionAnalyses].sort((a, b) => a.score - b.score);
    
    sortedByScore.forEach(analysis => {
      // Add first 2 suggestions from each section, prioritizing lowest scores
      analysis.suggestions.slice(0, 2).forEach(suggestion => {
        suggestions.add(suggestion);
      });
    });

    // Limit to top 8 suggestions to avoid overwhelming the user
    return Array.from(suggestions).slice(0, 8);
  }

  /**
   * Analyzes a specific section of the resume
   */
  public static analyzeSingleSection(
    resumeData: ResumeValues, 
    sectionType: SectionAnalysis['section']
  ): SectionAnalysis {
    switch (sectionType) {
      case 'contact':
        return validateContact(resumeData);
      case 'experience':
        return validateExperience(resumeData);
      case 'skills':
        return validateSkills(resumeData);
      case 'education':
        return validateEducation(resumeData);
      case 'projects':
        return validateProjects(resumeData);
      default:
        throw new Error(`Unknown section type: ${sectionType}`);
    }
  }

  /**
   * Gets the display color for a score
   */
  public static getScoreColor(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  /**
   * Gets the display badge color for a score
   */
  public static getScoreBadgeColor(score: number): string {
    if (score >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    if (score >= 75) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
  }

  /**
   * Gets the display status text for a score
   */
  public static getScoreStatus(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  }

  /**
   * Gets severity display properties
   */
  public static getSeverityConfig(severity: ValidationIssue['severity']) {
    const configs = {
      critical: {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-500',
        icon: '🚨'
      },
      high: {
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-500',
        icon: '⚠️'
      },
      medium: {
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-500',
        icon: '💡'
      },
      low: {
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-500',
        icon: 'ℹ️'
      }
    };

    return configs[severity];
  }
} 