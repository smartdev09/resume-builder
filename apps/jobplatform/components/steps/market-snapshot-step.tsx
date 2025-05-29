"use client";

import { Button } from "@resume/ui/button";
import { Home, DollarSign, Briefcase, Building } from "lucide-react";
import { toast } from "@resume/ui/sonner";

interface MarketSnapshotStepProps {
  jobFunction: string;
  onNext: () => void;
  onBack: () => void;
}

export function MarketSnapshotStep({
  jobFunction,
  onNext,
  onBack,
}: MarketSnapshotStepProps) {
  // Default to "Backend Engineer" if no job function is selected
  const displayJobFunction = jobFunction || "Backend Engineer";

  const handleNext = () => {
    if (jobFunction) {
      onNext();
    } else {
      toast.error("Please go back and select a Job Function before proceeding.");
    }
  };

  return (
    <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1 text-card-foreground">Quick market snapshot!</h2>
        <p className="text-xl text-muted-foreground">
          Here is how <span className="font-bold text-card-foreground">{displayJobFunction}</span>{" "}
          role looks like in the job market.
        </p>
      </div>

      <div className="bg-background rounded-xl p-6 border border-border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted rounded-xl p-6 flex items-center gap-4">
            <div className="bg-background rounded-full p-3 shadow-sm">
              <Home className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                4982+ <span className="text-primary">Remote Jobs</span>
              </h3>
              <p className="text-sm text-muted-foreground">Posted across the country</p>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-6 flex items-center gap-4">
            <div className="bg-background rounded-full p-3 shadow-sm">
              <DollarSign className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">$162,500+</h3>
              <p className="text-sm text-muted-foreground">
                Median annual salary offered
              </p>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-6 flex items-center gap-4">
            <div className="bg-background rounded-full p-3 shadow-sm">
              <Building className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Software and</h3>
              <h3 className="text-2xl font-bold text-foreground">Information Technology</h3>
              <p className="text-sm text-muted-foreground">
                Represented common industry
              </p>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-6 flex items-center gap-4">
            <div className="bg-background rounded-full p-3 shadow-sm">
              <Briefcase className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                1134+ <span className="text-primary">Jobs</span>
              </h3>
              <p className="text-sm text-muted-foreground">Posted within 14 days</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-bold mb-4 text-foreground">Hot Skills</h3>
          <div className="relative h-48 bg-muted rounded-xl p-4">
            <SkillsCloud />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          onClick={onBack}
          className="rounded-full bg-secondary text-secondary-foreground px-8 hover:bg-secondary/90"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="rounded-full bg-primary text-primary-foreground px-8 hover:bg-primary/90"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function SkillsCloud() {
  const skills = [
    {
      name: "Python",
      size: "text-3xl",
      color: "text-purple-700",
      position: "top-1/4 left-1/4",
    },
    {
      name: "TypeScript",
      size: "text-2xl",
      color: "text-blue-600",
      position: "top-1/3 right-1/4",
    },
    {
      name: "React",
      size: "text-3xl",
      color: "text-green-600",
      position: "bottom-1/4 left-1/3",
    },
    {
      name: "AWS",
      size: "text-2xl",
      color: "text-orange-500",
      position: "bottom-1/3 right-1/3",
    },
    {
      name: "Docker",
      size: "text-xl",
      color: "text-blue-500",
      position: "top-1/2 left-1/2",
    },
    {
      name: "PostgreSQL",
      size: "text-xl",
      color: "text-blue-700",
      position: "top-10 right-10",
    },
    {
      name: "Node.js",
      size: "text-xl",
      color: "text-green-700",
      position: "bottom-10 right-20",
    },
    {
      name: "JavaScript",
      size: "text-2xl",
      color: "text-yellow-600",
      position: "bottom-1/4 left-10",
    },
    {
      name: "REST APIs",
      size: "text-sm",
      color: "text-gray-700",
      position: "top-5 left-1/3",
    },
    {
      name: "GraphQL",
      size: "text-sm",
      color: "text-pink-600",
      position: "bottom-5 left-1/4",
    },
    {
      name: "Kubernetes",
      size: "text-lg",
      color: "text-blue-600",
      position: "bottom-1/2 right-10",
    },
    {
      name: "SQL",
      size: "text-base",
      color: "text-green-500",
      position: "top-1/3 left-10",
    },
    {
      name: "Java",
      size: "text-lg",
      color: "text-red-600",
      position: "top-10 left-1/2",
    },
    {
      name: "Go",
      size: "text-sm",
      color: "text-blue-400",
      position: "bottom-10 left-1/2",
    },
    {
      name: "C#",
      size: "text-sm",
      color: "text-purple-500",
      position: "top-1/2 right-5",
    },
    {
      name: "Linux",
      size: "text-sm",
      color: "text-gray-600",
      position: "bottom-1/3 left-5",
    },
    {
      name: "CSS",
      size: "text-base",
      color: "text-blue-500",
      position: "top-20 left-20",
    },
    {
      name: "HTML",
      size: "text-base",
      color: "text-orange-600",
      position: "bottom-20 right-1/4",
    },
    {
      name: "Angular",
      size: "text-sm",
      color: "text-red-500",
      position: "top-1/4 right-10",
    },
    {
      name: "Microservices",
      size: "text-sm",
      color: "text-gray-700",
      position: "bottom-5 right-5",
    },
  ];

  return (
    <div className="relative w-full h-full">
      {skills.map((skill, index) => (
        <div
          key={index}
          className={`absolute ${skill.position} ${skill.size} ${skill.color} font-medium transform -translate-x-1/2 -translate-y-1/2`}
          style={{
            transform: `translate(-50%, -50%) rotate(${
              Math.random() * 6 - 3
            }deg)`,
            opacity: Math.random() * 0.5 + 0.5,
          }}
        >
          {skill.name}
        </div>
      ))}
    </div>
  );
}
