"use client";

import { MessageSquare, X } from "lucide-react";
import { Button } from "@resume/ui/button";

interface AIAssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistantSidebar({ isOpen, onClose }: AIAssistantSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M10 10C10 8.9 9.1 8 8 8C6.9 8 6 8.9 6 10C6 11.1 6.9 12 8 12C9.1 12 10 11.1 10 10Z" />
              <path d="M22 20V18C22 15.8 20.2 14 18 14H14C11.8 14 10 15.8 10 18V20" />
              <path d="M4 20V19C4 17.9 4.9 17 6 17H8.5" />
              <path d="M18 2C19.1 2 20 2.9 20 4C20 5.1 19.1 6 18 6C16.9 6 16 5.1 16 4C16 2.9 16.9 2 18 2Z" />
              <path d="M18 6V10" />
              <path d="M18 10C15.8 10 14 11.8 14 14" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Orion AI Assistant</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Welcome Message */}
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              👋 Hi! I'm Orion, your AI job assistant. I can help you with:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Job search and filtering tips</li>
              <li>• Resume optimization advice</li>
              <li>• Interview preparation</li>
              <li>• Career guidance</li>
            </ul>
          </div>

          {/* Example Questions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Ask me something:</h3>
            <div className="space-y-2">
              {[
                "What are the best practices for remote job applications?",
                "How can I improve my job match score?",
                "What should I include in my cover letter?",
                "Tips for technical interviews?"
              ].map((question, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 text-sm text-muted-foreground hover:bg-muted rounded border border-border transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask Orion anything..."
            className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Button size="sm">
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 