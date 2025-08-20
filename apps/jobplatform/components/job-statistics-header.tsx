"use client";

interface JobStatisticsHeaderProps {
  totalJobsToday: number;
  totalJobs: number;
  activeTab: string;
  filteredJobsCount: number;
}

export function JobStatisticsHeader({
  totalJobsToday,
  totalJobs,
  activeTab,
  filteredJobsCount
}: JobStatisticsHeaderProps) {
  const getHeaderText = () => {
    switch (activeTab) {
      case "applied":
        return `${filteredJobsCount} Applied Job${filteredJobsCount !== 1 ? 's' : ''}`;
      case "liked":
        return `${filteredJobsCount} Liked Job${filteredJobsCount !== 1 ? 's' : ''}`;
      case "external":
        return `${filteredJobsCount} External Job${filteredJobsCount !== 1 ? 's' : ''}`;
      default:
        return `${filteredJobsCount} Jobs Found`;
    }
  };

  const getSubText = () => {
    if (activeTab === "jobs") {
      return `${totalJobsToday} new jobs today • ${totalJobs} total jobs available`;
    }
    return "View your job interactions and manage your applications";
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {getHeaderText()}
      </h2>
      <p className="text-muted-foreground">
        {getSubText()}
      </p>
    </div>
  );
} 