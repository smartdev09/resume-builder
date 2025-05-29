export interface ScrapedJob {
  id: number;
  job_id: string;
  site: string;
  job_url: string;
  job_url_direct: string;
  title: string;
  company: string;
  location: string;
  date_posted: string | null;
  job_type: string | null;
  is_remote: boolean | null;
  job_function: string | null;
  description: string | null;
  company_industry: string | null;
  company_logo: string | null;
  company_description: string | null;
  // Other potential properties
  salary_source?: string;
  interval?: string;
  min_amount?: number;
  max_amount?: number;
  currency?: string;
  job_level?: string;
  listing_type?: string;
  emails?: string;
  company_url?: string;
  company_url_direct?: string;
  company_addresses?: string;
  company_num_employees?: string;
  company_revenue?: string;
  skills?: string;
  experience_range?: string;
  company_rating?: number;
  company_reviews_count?: number;
  vacancy_count?: number;
  work_from_home_type?: string;
}

export interface JobMatch {
  job: ScrapedJob;
  score: number;
  reason: string;
}

export interface UserPreferences {
  jobFunction: string;
  jobType: string;
  location: string;
  openToRemote: boolean;
  needsSponsorship: boolean;
}

export interface FormData {
  jobFunction: string;
  jobType: string;
  location: string;
  openToRemote: boolean;
  workAuthorization: {
    h1bSponsorship: boolean;
  };
}

export interface BatchProgress {
  current: number;
  total: number;
}
export interface JobAnalysis{
    id: number;
    title: string;
    company: string;
    location: string;
    job_type: string | null;
    is_remote: boolean | null;
    job_function: string | null;
    description: string | null;
    work_from_home_type: string | undefined;
}