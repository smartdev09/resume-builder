import { useState, useEffect, useCallback } from 'react';
import useDebounce from '@resume/ui/hooks/use-debounce';
import { ResumeValues } from 'utils/validations';
import { ATSAnalysisResult, UseATSAnalysisReturn } from './types';
import { ATSGuidelinesEngine } from './ATSGuidelinesEngine';

/**
 * Hook for real-time ATS analysis with debouncing
 */
export const useATSAnalysis = (resumeData: ResumeValues, enabled: boolean = true): UseATSAnalysisReturn => {
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce resume data changes to avoid excessive analysis calls
  const debouncedResumeData = useDebounce(resumeData, 500);

  const analyzeResume = useCallback(async (data: ResumeValues) => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate async analysis (in case we want to add API calls later)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = ATSGuidelinesEngine.analyzeResume(data);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      console.error('ATS Analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const reanalyze = useCallback(() => {
    analyzeResume(resumeData);
  }, [analyzeResume, resumeData]);

  // Trigger analysis when debounced resume data changes
  useEffect(() => {
    if (enabled && debouncedResumeData) {
      analyzeResume(debouncedResumeData);
    }
  }, [debouncedResumeData, analyzeResume, enabled]);

  // Initial analysis on mount if enabled
  useEffect(() => {
    if (enabled && resumeData) {
      analyzeResume(resumeData);
    }
  }, [enabled]); // Only run on mount or when enabled changes

  return {
    analysis,
    loading,
    error,
    reanalyze
  };
}; 