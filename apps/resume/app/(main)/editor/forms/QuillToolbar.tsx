"use client";

import cn  from "@resume/ui/cn";
import { Button } from "@resume/ui/button";
import { Bold, List, Italic, Underline } from "lucide-react";
import type React from "react";

interface QuillToolbarProps {
  className?: string;
  onFormat: (format: string) => void;
  activeFormats: string[];
}

export function QuillToolbar({
  className,
  onFormat,
  activeFormats,
}: QuillToolbarProps) {
  const handleButtonClick = (format: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onFormat(format);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 border rounded-md bg-background",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 text-white",
          activeFormats.includes("bold") && "bg-accent"
        )}
        onClick={handleButtonClick("bold")}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 text-white",
          activeFormats.includes("italic") && "bg-accent"
        )}
        onClick={handleButtonClick("italic")}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 text-white",
          activeFormats.includes("underline") && "bg-accent"
        )}
        onClick={handleButtonClick("underline")}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <div className="w-px h-4 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 text-white",
          activeFormats.includes("list") && "bg-accent"
        )}
        onClick={handleButtonClick("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}