import { ResumeValues } from 'utils/validations';
import { useATSAnalysis } from '../shared/useATSAnalysis';
import { ATSGuidelinesEngine } from '../shared/ATSGuidelinesEngine';
import { AutoFixEngine } from '../shared/AutoFixEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@resume/ui/card';
import { Badge } from '@resume/ui/badge';
import { Button } from '@resume/ui/button';
import { RefreshCw, TrendingUp, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import cn from '@resume/ui/cn';
import { useState } from 'react';

interface ATSAnalyzerTabProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
}

export default function ATSAnalyzerTab({ resumeData, setResumeData }: ATSAnalyzerTabProps) {
  const { analysis, loading, error, reanalyze } = useATSAnalysis(resumeData);
  const [isApplyingFixes, setIsApplyingFixes] = useState(false);

  const handleAutoFix = async (issueIndex: number) => {
    if (!analysis) return;
    
    setIsApplyingFixes(true);
    try {
      const issue = analysis.criticalIssues[issueIndex];
      if (!issue) return;
      
      const autoFixes = AutoFixEngine.generateAutoFixes(resumeData, [issue]);
      
      if (autoFixes.length > 0) {
        const fixedData = AutoFixEngine.applyAutoFixes(resumeData, autoFixes);
        setResumeData(fixedData);
        
        // Small delay to show the change
        setTimeout(() => {
          reanalyze();
        }, 500);
      }
    } catch (err) {
      console.error('Auto-fix failed:', err);
    } finally {
      setIsApplyingFixes(false);
    }
  };

  const handleApplyAllAutoFixes = async () => {
    if (!analysis) return;
    
    setIsApplyingFixes(true);
    try {
      const autoFixableIssues = analysis.criticalIssues.filter(issue => issue.autoFixAvailable);
      const autoFixes = AutoFixEngine.generateAutoFixes(resumeData, autoFixableIssues);
      
      if (autoFixes.length > 0) {
        const fixedData = AutoFixEngine.applyAutoFixes(resumeData, autoFixes);
        setResumeData(fixedData);
        
        // Reanalyze after applying fixes
        setTimeout(() => {
          reanalyze();
        }, 500);
      }
    } catch (err) {
      console.error('Bulk auto-fix failed:', err);
    } finally {
      setIsApplyingFixes(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Analyzing resume...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Analysis failed: {error}</p>
        </div>
        <Button onClick={reanalyze} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>No analysis available</p>
      </div>
    );
  }

  const { overallScore, complianceLevel, sectionAnalyses, criticalIssues, topSuggestions } = analysis;
  const autoFixableIssues = criticalIssues.filter(issue => issue.autoFixAvailable);

  return (
    <div className="p-6 space-y-6">
      {/* Overall Score Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">ATS Compatibility Score</CardTitle>
              <p className="text-muted-foreground">Real-time analysis of your resume</p>
            </div>
            <div className="text-right">
              <div className={cn("text-4xl font-bold", ATSGuidelinesEngine.getScoreColor(overallScore))}>
                {overallScore}%
              </div>
              <Badge className={ATSGuidelinesEngine.getScoreBadgeColor(overallScore)}>
                {ATSGuidelinesEngine.getScoreStatus(overallScore)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Auto-Fix Section */}
      {autoFixableIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Fixes Available ({autoFixableIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <p className="font-medium">Auto-fix {autoFixableIssues.length} issues automatically</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Remove pronouns, improve verbs, and fix formatting
                </p>
              </div>
              <Button 
                onClick={handleApplyAllAutoFixes}
                disabled={isApplyingFixes}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                {isApplyingFixes ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Fix All
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Section Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionAnalyses.map((section) => {
              const config = ATSGuidelinesEngine.getSeverityConfig(
                section.score >= 75 ? 'low' : section.score >= 50 ? 'medium' : 'high'
              );
              
              return (
                <div key={section.section} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize flex items-center gap-2">
                      {getSectionIcon(section.section)}
                      {section.section === 'contact' ? 'Contact Info' : 
                       section.section === 'experience' ? 'Work Experience' :
                       section.section}
                    </span>
                    <span className={cn("font-bold", ATSGuidelinesEngine.getScoreColor(section.score))}>
                      {section.score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-500",
                        section.score >= 75 ? "bg-green-500" :
                        section.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{ width: `${section.score}%` }}
                    />
                  </div>
                  {section.issues.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {section.issues.length} issue{section.issues.length !== 1 ? 's' : ''} found
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Critical Issues */}
      {criticalIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              Critical Issues ({criticalIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalIssues.slice(0, 5).map((issue, index) => {
              const config = ATSGuidelinesEngine.getSeverityConfig(issue.severity);
              
              return (
                <div key={index} className={cn("border-l-4 p-4 rounded", config.borderColor, config.bgColor)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={cn("font-medium", config.color)}>
                        {config.icon} {issue.message}
                      </h4>
                      <p className="text-sm mt-1 text-muted-foreground">
                        {issue.suggestion}
                      </p>
                    </div>
                    {issue.autoFixAvailable && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="ml-4"
                        onClick={() => handleAutoFix(index)}
                        disabled={isApplyingFixes}
                      >
                        {isApplyingFixes ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <Zap className="w-3 h-3 mr-1" />
                            Fix
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {criticalIssues.length > 5 && (
              <div className="text-center text-muted-foreground text-sm">
                +{criticalIssues.length - 5} more issues
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Top Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Top Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {topSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium mt-0.5">
                  {index + 1}
                </div>
                <span className="text-sm">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={reanalyze} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>
    </div>
  );
}

function getSectionIcon(section: string) {
  const icons: Record<string, string> = {
    contact: '📱',
    summary: '📝',
    experience: '💼',
    skills: '🛠️',
    education: '🎓',
    projects: '🚀'
  };
  return icons[section] || '📄';
} 