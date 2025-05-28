import { prisma } from "@resume/db";
import { ResumeValues } from "./validations";

export interface EditorFormProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
}

export const resumeDataIncludes = {
    workExperience: true,
    education: true,
    skillSections: true,
} 


// export type ResumeServerData = Prisma.ResumeGetPayload<{
//     include: typeof resumeDataIncludes
// }>

export type ResumeServerData = any;