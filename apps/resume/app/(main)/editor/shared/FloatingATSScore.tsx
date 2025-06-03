import { ResumeValues } from 'utils/validations';
import { useATSAnalysis } from './useATSAnalysis';
import { ATSGuidelinesEngine } from './ATSGuidelinesEngine';
import { Button } from '@resume/ui/button';
import { BarChart3, RefreshCw } from 'lucide-react';
import cn from '@resume/ui/cn';

interface FloatingATSScoreProps {
  resumeData: ResumeValues;
  onViewDetails?: () => void;
  className?: string;
}

export default function FloatingATSScore({ 
  resumeData, 
  onViewDetails, 
  className 
}: FloatingATSScoreProps) {
  const { analysis, loading } = useATSAnalysis(resumeData);

  if (loading) {
    return (
      <div className={cn(
        "bg-white dark:bg-gray-900 border shadow-lg rounded-lg p-3 flex items-center gap-3",
        className
      )}>
        <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
        <div className="text-sm">
          <div className="font-medium">Analyzing...</div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const { overallScore } = analysis;
  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 border shadow-lg rounded-lg p-3 flex items-center gap-3",
      className
    )}>
      {/* Circular Progress */}
      <div className="relative">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 40 40">
          {/* Background circle */}
          <circle 
            cx="20" 
            cy="20" 
            r="18"
            stroke="currentColor" 
            strokeWidth="3"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle 
            cx="20" 
            cy="20" 
            r="18"
            stroke="currentColor"
            strokeWidth="3" 
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              "transition-all duration-500 ease-in-out",
              overallScore >= 90 ? "text-green-500" :
              overallScore >= 75 ? "text-blue-500" :
              overallScore >= 60 ? "text-yellow-500" : "text-red-500"
            )}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
          {overallScore}%
        </span>
      </div>

      {/* Score Info */}
      <div className="flex-1">
        <div className="text-sm font-medium">ATS Score</div>
        <div className={cn(
          "text-xs",
          ATSGuidelinesEngine.getScoreColor(overallScore)
        )}>
          {ATSGuidelinesEngine.getScoreStatus(overallScore)}
        </div>
      </div>

      {/* View Details Button */}
      {onViewDetails && (
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onViewDetails}
          className="text-xs h-8 px-2"
        >
          <BarChart3 className="w-3 h-3 mr-1" />
          Details
        </Button>
      )}
    </div>
  );
} 