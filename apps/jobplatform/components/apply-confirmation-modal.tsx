"use client";

import { X } from "lucide-react";
import { Button } from "@resume/ui/button";

interface ApplyConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (applied: boolean) => void;
  jobTitle: string;
  company: string;
}

export function ApplyConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  jobTitle, 
  company 
}: ApplyConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Application Confirmation</h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <span className="font-medium text-card-foreground">Job:</span> {jobTitle}
            </p>
            <p className="mb-4">
              <span className="font-medium text-card-foreground">Company:</span> {company}
            </p>
          </div>
          
          <div className="text-sm text-card-foreground">
            Did you successfully submit your application for this position?
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => onConfirm(true)}
              className="flex-1"
            >
              Yes, I Applied
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onConfirm(false)}
              className="flex-1"
            >
              No, I Didn't Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 