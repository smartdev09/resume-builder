import { Prisma } from "@prisma/client";
import { ResumeValues } from "./validations";

export interface EditorFormProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
}

export const resumeDataIncludes = {
    WorkExperience: true,
    Education: true
} 


export type ResumeServerData = Prisma.ResumeGetPayload<{
    include: typeof resumeDataIncludes
}>