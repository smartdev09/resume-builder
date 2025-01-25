import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal("")) // string | undefined | ""

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
  selectedTemplate: z.string(),
})

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Cannot be empty"),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export const personalInfoSchema = z.object({
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
  photo: z
  .custom<File | undefined>()
  .refine(
    (file) => !file || (file instanceof File && file.type.startsWith("image/")),
    "Must be an image file"
  )
  .refine(( file => !file || file.size <= 1024 * 1024 * 2), "File must be less than 4 mb")
})

export type PersonalInfoValues = z.infer<typeof personalInfoSchema> 

export const workExperienceSchema = z.object({
  workExperiences: z.array(
    z.object({
      position: optionalString,
      company: optionalString,
      startDate: optionalString,
      endDate: optionalString,
      description: optionalString
    })
  )
  .optional()
})

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>

export const educationSchema = z.object({
  educations: z.array(
    z.object({
      degree: optionalString,
      school: optionalString,
      startDate: optionalString,
      endDate: optionalString,
      description: optionalString
    })
  )
  .optional()
})

export type EducationValues = z.infer<typeof educationSchema>

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional()
})

export type SkillsValues = z.infer<typeof skillsSchema>;

export const summarySchema = z.object({
  summary: optionalString
})

export type SummaryValues = z.infer<typeof summarySchema>

export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
})

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
  photo?: File | string | null;
}