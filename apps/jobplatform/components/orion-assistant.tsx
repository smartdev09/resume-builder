import { MessageSquare } from 'lucide-react';
import { Button } from '@resume/ui/button';
import React from 'react'

const OrionAssistant = () => {
  return (
    <>
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm sticky top-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-card-foreground">
            Orion AI Assistant
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-3 text-sm">
            <h4 className="font-medium text-card-foreground">
              Tasks I can assist you with:
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>🎯</span>
                  <span>Adjust current preference</span>
                </div>
                <div className="ml-6 text-xs text-muted-foreground mt-1">
                  Fine-tune your job search criteria
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>⭐</span>
                  <span>Top Match jobs</span>
                </div>
                <div className="ml-6 text-xs text-muted-foreground mt-1">
                  Explore jobs where you shine as a top candidate
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>💬</span>
                  <span>Ask Orion</span>
                </div>
                <div className="ml-6 text-xs text-muted-foreground mt-1">
                  Get detailed insights on specific jobs
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-3">
              Ask me anything...
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your question..."
                className="flex-1 text-sm px-3 py-2 border border-border rounded-md bg-background"
              />
              <Button size="sm" className="px-3">
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrionAssistant