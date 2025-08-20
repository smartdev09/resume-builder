"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@resume/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@resume/ui/alert";
import { toast } from "@resume/ui/sonner";

interface ResumeUploadStepProps {
  onComplete: () => void;   
  onBack: () => void;
  isLoading?: boolean;
}

export function ResumeUploadStep({
  onComplete,
  onBack,
  isLoading = false,
}: ResumeUploadStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success("Resume uploaded successfully");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      toast.success("Resume uploaded successfully");
    }
  };

  const handleComplete = () => {
    if (!file) {
      toast.info("Proceeding without resume. You can add it later from your profile.");
    }
    onComplete();
  };

  return (
    <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1 text-card-foreground">
          Your next job is closer than you think!
        </h2>
        <p className="text-xl text-muted-foreground">
          Upload your resume to improve job matching (optional).
        </p>
      </div>

      <Alert className="bg-accent/50 border-accent mb-8">
        <AlertDescription className="text-accent-foreground">
          Data privacy is the top priority at Jobright. Your resume will only be
          used for job matching and will never be shared with third parties. For
          details, please see our{" "}
          <a href="#" className="underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </AlertDescription>
      </Alert>

      <div className="flex flex-col items-center justify-center">
        <div
          className={`w-full max-w-md h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging 
              ? "border-primary bg-accent/50" 
              : file 
                ? "border-primary bg-accent/30" 
                : "border-border bg-muted/30"
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLoading && document.getElementById("resume-upload")?.click()}
        >
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />

          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-primary font-medium">Finding matching jobs...</p>
            </div>
          ) : (
            <>
              <div className={`${file ? "bg-accent" : "bg-muted"} rounded-full p-6 mb-4`}>
                <Upload className={`h-8 w-8 ${file ? "text-accent-foreground" : "text-muted-foreground"}`} />
              </div>

              <h3 className="text-xl font-bold mb-2 text-card-foreground">Upload Your Resume</h3>

              {file ? (
                <p className="text-primary font-medium">{file.name}</p>
              ) : (
                <p className="text-muted-foreground text-center mt-2">
                  Files should be in <span className="font-medium">PDF</span> or{" "}
                  <span className="font-medium">Word</span> format and must not
                  exceed 10MB in size.
                </p>
              )}
            </>
          )}
        </div>
        {!file && !isLoading && (
          <p className="text-muted-foreground mt-4 text-center">
            Resume upload is optional. You can skip this step and add your resume later.
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="secondary"
          onClick={onBack}
          className="rounded-full px-8"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={handleComplete}
          className="rounded-full px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
          ) : (
            file ? "Start Matching" : "Skip & Continue"
          )}
        </Button>
      </div>
    </div>
  );
}
