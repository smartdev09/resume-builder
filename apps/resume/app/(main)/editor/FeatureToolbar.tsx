'use client'

import { Button } from "@resume/ui/button";
import { FileText, Palette, Bot, BarChart3, Layout, Zap } from "lucide-react";

interface ToolButton {
  id: string;
  icon: React.ReactNode;
  label: string;
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
      label: 'Edit'
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
      label: 'Practice'
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
      label: 'Search'
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
            variant={activeTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className="gap-2"
          >
            {tool.icon}
            <span className="hidden sm:inline">{tool.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
} 