"use client";
import { Button } from "@resume/ui/button";
import { Input } from "@resume/ui/input";
import { Checkbox } from "@resume/ui/checkbox";
import { JobFunctionSelect } from "@/components/job-function-select";
import { HelpCircle } from "lucide-react";
import { toast } from "@resume/ui/sonner";

interface JobPreferencesStepProps {
  formData: {
    jobFunction: string;
    jobType: string;
    location: string;
    openToRemote: boolean;
    workAuthorization: {
      h1bSponsorship: boolean;
    };
  };
  updateFormData: (data: Partial<JobPreferencesStepProps["formData"]>) => void;
  onNext: () => void;
}

export function JobPreferencesStep({
  formData,
  updateFormData,
  onNext
}: JobPreferencesStepProps) {
  const jobTypes = ["Full-time", "Contract", "Part-time", "Internship"];

  const validateForm = () => {
    const missingFields = [];
    
    if (!formData.jobFunction) {
      missingFields.push("Job Function");
    }
    
    if (!formData.jobType) {
      missingFields.push("Job Type");
    }
    
    if (missingFields.length === 0) {
      onNext();
    } else {
      toast.error(`Please fill in the required fields: ${missingFields.join(", ")}`);
    }
  };

  return (
    <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1 text-card-foreground">I see. Speed is important.</h2>
        <p className="text-xl text-muted-foreground">Now, what type of role are you looking for?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block font-medium text-card-foreground">
            <span className="text-destructive">*</span> Job Function{" "}
            <span className="text-muted-foreground font-normal">
              (select from drop-down for best results)
            </span>
          </label>
          <JobFunctionSelect
            value={formData.jobFunction}
            onChange={(value) => {
              updateFormData({ jobFunction: value });
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-card-foreground">
            <span className="text-destructive">*</span> Job Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center">
                <div className="flex items-center h-12 px-4 border border-border rounded-md bg-muted">
                  <Checkbox
                    id={`job-type-${type}`}
                    checked={formData.jobType === type}
                    onCheckedChange={() => {
                      updateFormData({ jobType: type });
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`job-type-${type}`} className="text-sm text-muted-foreground">
                    {type}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-card-foreground">Location</label>
          <Input
            placeholder="Within US"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            className="bg-muted"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remote"
            checked={formData.openToRemote}
            onCheckedChange={(checked) =>
              updateFormData({ openToRemote: checked as boolean })
            }
          />
          <div className="flex items-center gap-1">
            <label htmlFor="remote" className="font-medium text-card-foreground">
              Open to Remote
            </label>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <label className="block font-medium text-card-foreground">Work Authorization</label>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="h1b"
              checked={formData.workAuthorization.h1bSponsorship}
              onCheckedChange={(checked) =>
                updateFormData({
                  workAuthorization: {
                    h1bSponsorship: checked as boolean,
                  },
                })
              }
            />
            <label htmlFor="h1b" className="text-card-foreground">H1B sponsorship</label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={validateForm}
          className="rounded-full bg-primary text-primary-foreground px-8 hover:bg-primary/90"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
