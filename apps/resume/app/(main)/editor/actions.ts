"use server"

import { auth } from "utils/auth";
import { prisma } from "@resume/db";
import { resumeSchema, ResumeValues } from "utils/validations";
import { del, put } from "@vercel/blob";
import path from "path";

export async function saveResume(values: ResumeValues) {
    const { id } = values;

    console.log('values', values)
    
    const { photo, workExperiences, educations, projects, languages, certifications, skillSections, ...resumeValues } = resumeSchema.parse(values);

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
                
                workExperience: {
                    deleteMany: {},
                    create: workExperiences?.map((exp) => ({
                        ...exp,
                        startDate: exp.startDate ? new Date(exp.startDate  + "T00:00:00.000Z") : undefined,
                        endDate: exp.endDate ? new Date(exp.endDate  + "T00:00:00.000Z") : undefined,
                    }))
                },
                education: {
                    deleteMany: {},
                    create: educations?.map((edu) => ({
                        degree: edu.degree,
                        school: edu.school,
                        startDate: edu.startDate ? new Date(edu.startDate  + "T00:00:00.000Z") : undefined,
                        endDate: edu.endDate ? new Date(edu.endDate  + "T00:00:00.000Z" ) : undefined,
                    }))
                },
                projects: {
                    // deleteMany: {},
                    create: projects?.map((project) => ({
                        ...project,
                        startDate: project.startDate ? new Date(project.startDate  + "T00:00:00.000Z") : undefined,
                        endDate: project.endDate ? new Date(project.endDate  + "T00:00:00.000Z") : undefined,
                        description: project.description
                    }))
                },
                certificates: {
                    deleteMany: {},
                    create: certifications?.map((certificate) => ({
                        ...certificate,
                        completionDate: certificate.completionDate ? new Date(certificate.completionDate  + "T00:00:00.000Z") : undefined,
                        source: certificate.source,
                        link: certificate.link
                    }))
                },
                languages: {
                    deleteMany: {},
                    create: languages?.map((language) => ({
                        ...language,
                        name: language.name,
                        proficiency: language.proficiency
                    }))
                },
                skillSections: {
                    deleteMany: {},
                    create: skillSections?.map((section) => ({
                        name: section.name,
                        skills: section.skills,
                        order: section.order
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
              workExperience: {
                create: workExperiences?.map((exp) => ({
                  ...exp,
                  startDate: exp.startDate ? new Date(exp.startDate  + "T00:00:00.000Z") : undefined,
                  endDate: exp.endDate ? new Date(exp.endDate  + "T00:00:00.000Z") : undefined,
                })),
              },
              education: {
                create: educations?.map((edu) => ({
                  degree: edu.degree,
                  school: edu.school,
                  startDate: edu.startDate ? new Date(edu.startDate  + "T00:00:00.000Z") : undefined,
                  endDate: edu.endDate ? new Date(edu.endDate  + "T00:00:00.000Z") : undefined,
                })),
              },
              projects: {
                // deleteMany: {},
                create: projects?.map((project) => ({
                    ...project,
                    startDate: project.startDate ? new Date(project.startDate  + "T00:00:00.000Z") : undefined,
                    endDate: project.endDate ? new Date(project.endDate  + "T00:00:00.000Z") : undefined,
                    description: project.description
                 }))
            },
            certificates: {
                // deleteMany: {},
                create: certifications?.map((certificate) => ({
                    ...certificate,
                    completionDate: certificate.completionDate ? new Date(certificate.completionDate  + "T00:00:00.000Z") : undefined,
                    source: certificate.source,
                    link: certificate.link
                }))
            },
            languages: {
                // deleteMany: {},
                create: languages?.map((language) => ({
                    ...language,
                    name: language.name,
                    proficiency: language.proficiency
                }))
            },
            skillSections: {
                create: skillSections?.map((section) => ({
                    name: section.name,
                    skills: section.skills,
                    order: section.order
                }))
            },
            },
          });
    }

}