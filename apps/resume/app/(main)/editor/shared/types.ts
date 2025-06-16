// Core ATS Analysis Types
export type SectionType = 'contact' | 'summary' | 'experience' | 'skills' | 'education' | 'projects';
export type IssueType = 'insufficient_detail' | 'missing_quantification' | 'personal_pronouns' | 'weak_verbs' | 'missing_keywords' | 'format_issues';
export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ComplianceLevel = 'excellent' | 'good' | 'fair' | 'poor';

export interface ValidationIssue {
  type: IssueType;
  section: SectionType;
  severity: IssueSeverity;
  message: string;
  suggestion: string;
  autoFixAvailable: boolean;
  sectionIndex?: number;
  fieldName?: string;
}

export interface SectionAnalysis {
  section: SectionType;
  score: number; // 0-100
  issues: ValidationIssue[];
  suggestions: string[];
  compliantAspects: string[];
}

export interface ATSAnalysisResult {
  overallScore: number; // 0-100
  complianceLevel: ComplianceLevel;
  sectionAnalyses: SectionAnalysis[];
  criticalIssues: ValidationIssue[];
  topSuggestions: string[];
  analysisTimestamp: string;
}

export interface SectionGuidelines {
  type: SectionType;
  rules: ValidationRule[];
  weights: Record<string, number>;
  requiredFields: string[];
  optionalFields: string[];
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: IssueSeverity;
  weight: number;
  validate: (data: any) => ValidationResult;
}

export interface ValidationResult {
  passed: boolean;
  score: number;
  issues: ValidationIssue[];
}

export interface AutoFix {
  type: string;
  sectionIndex?: number;
  fieldName?: string;
  description: string;
  apply: (data: any) => any;
}

// Real-time analysis hook return type
export interface UseATSAnalysisReturn {
  analysis: ATSAnalysisResult | null;
  loading: boolean;
  error: string | null;
  reanalyze: () => void;
} 