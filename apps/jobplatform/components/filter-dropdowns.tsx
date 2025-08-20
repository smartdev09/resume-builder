"use client";

import { useState } from "react";
import { ChevronDown, Filter, MapPin, Clock, Briefcase, Calendar, Target } from "lucide-react";
import { Button } from "@resume/ui/button";
import { Badge } from "@resume/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@resume/ui/dropdown-menu";

interface FilterDropdownsProps {
  filters: {
    workType: string[];
    jobLevel: string[];
    jobType: string[];
    datePosted: string;
    minMatchScore: number;
  };
  onFilterChange: (filterType: 'workType' | 'jobLevel' | 'jobType' | 'datePosted' | 'minMatchScore', value: string | number) => void;
  onClearAllFilters: () => void;
  getActiveFilterCount: () => number;
}

export function FilterDropdowns({ 
  filters, 
  onFilterChange, 
  onClearAllFilters, 
  getActiveFilterCount 
}: FilterDropdownsProps) {
  
  // Work Type Dropdown (Multi-select)
  const WorkTypeDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <MapPin className="w-4 h-4 mr-2" />
          Work Type
          {filters.workType.length > 0 && (
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {filters.workType.length}
            </Badge>
          )}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Work Environment</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {['Remote', 'Onsite', 'Hybrid'].map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={filters.workType.includes(type)}
            onCheckedChange={() => onFilterChange('workType', type)}
          >
            {type}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Job Level Dropdown (Multi-select)
  const JobLevelDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Briefcase className="w-4 h-4 mr-2" />
          Experience
          {filters.jobLevel.length > 0 && (
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {filters.jobLevel.length}
            </Badge>
          )}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Experience Level</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {['Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
          <DropdownMenuCheckboxItem
            key={level}
            checked={filters.jobLevel.includes(level)}
            onCheckedChange={() => onFilterChange('jobLevel', level)}
          >
            {level}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Job Type Dropdown (Multi-select)
  const JobTypeDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Clock className="w-4 h-4 mr-2" />
          Job Type
          {filters.jobType.length > 0 && (
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {filters.jobType.length}
            </Badge>
          )}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Employment Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={filters.jobType.includes(type)}
            onCheckedChange={() => onFilterChange('jobType', type)}
          >
            {type}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Date Posted Dropdown (Single-select)
  const DatePostedDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Calendar className="w-4 h-4 mr-2" />
          Date Posted
          {filters.datePosted && (
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              1
            </Badge>
          )}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Posted Within</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup 
          value={filters.datePosted || 'Anytime'} 
          onValueChange={(value) => onFilterChange('datePosted', value === 'Anytime' ? '' : value)}
        >
          {['Last 24 hours', 'Last week', 'Last month', 'Anytime'].map((period) => (
            <DropdownMenuRadioItem key={period} value={period}>
              {period}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Match Score Dropdown (Single-select with preset ranges)
  const MatchScoreDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Target className="w-4 h-4 mr-2" />
          Match Score
          {filters.minMatchScore > 0 && (
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {filters.minMatchScore}%+
            </Badge>
          )}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Minimum Match</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup 
          value={filters.minMatchScore.toString()} 
          onValueChange={(value) => onFilterChange('minMatchScore', parseInt(value))}
        >
          {[
            { value: '0', label: 'Any Match' },
            { value: '70', label: '70%+ Match' },
            { value: '80', label: '80%+ Match' },
            { value: '90', label: '90%+ Match' },
          ].map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Filter Dropdowns */}
      <WorkTypeDropdown />
      <JobLevelDropdown />
      <JobTypeDropdown />
      <DatePostedDropdown />
      <MatchScoreDropdown />

      {/* Clear Filters Button */}
      {activeFilterCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearAllFilters}
          className="h-9 text-muted-foreground hover:text-foreground"
        >
          Clear All ({activeFilterCount})
        </Button>
      )}

      {/* Active Filter Count Indicator */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied</span>
        </div>
      )}
    </div>
  );
} 