'use client'

import { Button } from "@resume/ui/button";
import { FileText, Palette, Bot, BarChart3, Layout, Zap } from "lucide-react";
import cn from "@resume/ui/cn";

interface ToolButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

interface FeatureToolbarProps {
  activeFeature: string;
  activeTool: string;
  onToolChange: (tool: string) => void;
}

const toolsByFeature: Record<string, ToolButton[]> = {
  'resume-editor': [
    {
      id: 'edit',
      icon: <FileText className="w-4 h-4" />,
      label: 'Edit',
      active: true
    },
    {
      id: 'style',
      icon: <Palette className="w-4 h-4" />,
      label: 'Style'
    },
    // {
    //   id: 'ai-generator',
    //   icon: <Bot className="w-4 h-4" />,
    //   label: 'AI Generator'
    // },
    // {
    //   id: 'ats-analyzer',
    //   icon: <BarChart3 className="w-4 h-4" />,
    //   label: 'ATS Analyzer'
    // },
    {
      id: 'templates',
      icon: <Layout className="w-4 h-4" />,
      label: 'Templates'
    },
    {
      id: 'tools',
      icon: <Zap className="w-4 h-4" />,
      label: 'Tools'
    }
  ],
  'interview-prep': [
    {
      id: 'practice',
      icon: <FileText className="w-4 h-4" />,
      label: 'Practice',
      active: true
    },
    {
      id: 'questions',
      icon: <Bot className="w-4 h-4" />,
      label: 'Questions'
    },
    {
      id: 'feedback',
      icon: <BarChart3 className="w-4 h-4" />,
      label: 'Feedback'
    }
  ],
  'job-search': [
    {
      id: 'search',
      icon: <FileText className="w-4 h-4" />,
      label: 'Search',
      active: true
    },
    {
      id: 'tracker',
      icon: <BarChart3 className="w-4 h-4" />,
      label: 'Tracker'
    },
    {
      id: 'saved',
      icon: <Zap className="w-4 h-4" />,
      label: 'Saved Jobs'
    }
  ]
};

export default function FeatureToolbar({ activeFeature, activeTool, onToolChange }: FeatureToolbarProps) {
  const tools = toolsByFeature[activeFeature] || [];

  return (
    <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 gap-1 relative z-30">
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              activeTool === tool.id || tool.active
                ? "bg-white dark:bg-gray-600 text-primary shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-600/50"
            )}
          >
            {tool.icon}
            <span className="hidden sm:inline">{tool.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
} 