"use server"

import { auth } from "utils/auth";
import { prisma } from "@resume/db";
import { resumeSchema, ResumeValues } from "utils/validations";
import { del, put } from "@vercel/blob";
import path from "path";

export async function saveResume(values: ResumeValues) {
    const { id } = values;

    console.log('values', values)
    
    const { photo, workExperiences, educations, ...resumeValues } = resumeSchema.parse(values);

    console.log('RV', resumeValues)

    const session = await auth();

    console.log('session', session)

    if(!session?.user) {
        throw new Error("Please login to continue")
    }
    
    const existingResume = id ? await prisma.resume.findUnique({ where: { id, userid: session?.user?.id }}) : null

    let newPhotoUrl: string | undefined | null = undefined;

    if(photo instanceof File) {
        if(existingResume?.photoUrl) {
            await del(existingResume.photoUrl);
        }

        const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
            access: 'public'
        })

        newPhotoUrl = blob.url;
    } else if(photo === null) {
        if(existingResume?.photoUrl) {
            await del(existingResume?.photoUrl)
        }

        newPhotoUrl = null;
    }

    if(id) {
        return prisma.resume.update({
            where: { id },
            data: {
                ...resumeValues,
                photoUrl: newPhotoUrl,
                WorkExperience: {
                    deleteMany: {},
                    create: workExperiences?.map((exp) => ({
                        ...exp,
                        startDate: exp.startDate ? new Date(exp.startDate  + "T00:00:00.000Z") : undefined,
                        endDate: exp.endDate ? new Date(exp.endDate  + "T00:00:00.000Z") : undefined,

                     }))
                },
                Education: {
                    deleteMany: {},
                    create: educations?.map((edu) => ({
                        ...edu,
                        startDate: edu.startDate ? new Date(edu.startDate  + "T00:00:00.000Z") : undefined,
                        endDate: edu.endDate ? new Date(edu.endDate  + "T00:00:00.000Z" ) : undefined,

                     }))
                },
                updatedAt: new Date()
            }
        })
    } else {
        console.log('USERR IDDD', session.user.id)
        return prisma.resume.create({
            data: {
              ...resumeValues,
              selectedTemplate: 'simple',
              userid: session.user.id!,
              photoUrl: newPhotoUrl,
              WorkExperience: {
                create: workExperiences?.map((exp) => ({
                  ...exp,
                  startDate: exp.startDate ? new Date(exp.startDate  + "T00:00:00.000Z") : undefined,
                  endDate: exp.endDate ? new Date(exp.endDate  + "T00:00:00.000Z") : undefined,
                })),
              },
              Education: {
                create: educations?.map((edu) => ({
                  ...edu,
                  startDate: edu.startDate ? new Date(edu.startDate  + "T00:00:00.000Z") : undefined,
                  endDate: edu.endDate ? new Date(edu.endDate  + "T00:00:00.000Z") : undefined,
                })),
              },
            },
          });
    }

}