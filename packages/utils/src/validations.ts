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
  linkedin: optionalString,
  github: optionalString,
  website: optionalString,
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

export const skillSectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Section name is required"),
  skills: z.array(z.string().trim()).default([]),
  order: z.number().default(0)
});

export const skillsSchema = z.object({
  skillSections: z.array(skillSectionSchema).default([])
});

export type SkillSectionValues = z.infer<typeof skillSectionSchema>;
export type SkillsValues = z.infer<typeof skillsSchema>;

export const summarySchema = z.object({
  summary: optionalString
})

export type SummaryValues = z.infer<typeof summarySchema>

export const projectSchema = z.object({
  projects: z.array(
    z.object({
      name: optionalString,
      role: optionalString,
      startDate: optionalString,
      endDate: optionalString,
      description: optionalString
    })
  )
  .optional()
})

export type ProjectValues = z.infer<typeof projectSchema>

export const languageSchema = z.object({
  languages: z.array(
    z.object({
      name: optionalString,
      proficiency: z.enum(["fluent", "proficient", "conversational"]).optional()
    })
  )
  .optional()
});

export type LanguageValues = z.infer<typeof languageSchema>

export const certificationSchema = z.object({
  certifications: z.array(
    z.object({
      name: optionalString,
      completionDate: optionalString,
      source: optionalString,
      link: z.string().url("Invalid URL").optional().or(z.literal("")),
    })
  ).optional()
});

export type CertificationValues = z.infer<typeof certificationSchema>;

export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  skillSections: z.array(skillSectionSchema).default([]),
  ...summarySchema.shape,
  ...projectSchema.shape,
  ...languageSchema.shape,
  ...certificationSchema.shape,
  primaryColorHex: optionalString,
  secondaryColorHex: optionalString,
  primaryFontSize: optionalString,
  secondaryFontSize: optionalString,
  borderStyle: optionalString,
  fontStyle: optionalString,
})

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
  photo?: File | string | null;
}