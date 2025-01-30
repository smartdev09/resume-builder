import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResumeServerData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function fileReplacer(key: string, value: File) {
  return value instanceof File ? {
      name: value.name,
      size: value.name,
      type: value.type,
      lastModified: value.lastModified
  } : value;
}

export function mapToResumeValues(data: ResumeServerData) {
  console.log('data', data)
  return {
      id: data.id,
      title: data.title || undefined,
      description: data.description || undefined,
      photo: data.photoUrl || undefined,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      jobTitle: data.jobTitle || undefined,
      phone: data.phone || undefined,
      city: data.city || undefined,
      country: data.country || undefined,
      email: data.email || undefined,
      workExperiences: data.WorkExperience && data.WorkExperience.map((exp: any) => (
        {
          position: exp.position || undefined,
          company: exp.company || undefined,
          startDate: exp.startDate ? exp.startDate.toISOString().split("T")[0] : undefined,
          endDate: exp.endDate ? exp.endDate.toISOString().split("T")[0] : undefined,
          description: exp.description || undefined
        }
      )),
      educations: data.Education && data.Education.map((edu: any) => (
        {
          degree: edu.degree || undefined,
          school: edu.school || undefined,
          startDate: edu.startDate ? edu.startDate.toISOString().split("T")[0] : undefined,
          endDate: edu.endDate ? edu.endDate.toISOString().split("T")[0] : undefined,
        }
      )),
      skills: data.skills,
      colorHex: data.colorHex,
      borderStyle: data.borderStyle,
      summary: data.summary || undefined,
      selectedTemplate: data.selectedTemplate,

  }
}