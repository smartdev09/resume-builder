"use client";

import { Button } from "@resume/ui/button";

interface JobTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counters?: {
    applied: number;
    liked: number;
    external: number;
  };
}

export function JobTabs({ activeTab, onTabChange, counters }: JobTabsProps) {
  const tabs = [
    { id: "jobs", label: "Jobs", counter: undefined },
    { id: "applied", label: "Applied", counter: counters?.applied },
    { id: "liked", label: "Liked", counter: counters?.liked },
    { id: "external", label: "External", counter: counters?.external },
  ];

  return (
    <div className="flex gap-1 border-b border-border bg-background sticky top-0 z-20">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          className={`px-4 py-2 rounded-none border-b-2 transition-colors ${
            activeTab === tab.id
              ? "border-primary"
              : "border-transparent"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.counter !== undefined && tab.counter > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
              {tab.counter}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
} 