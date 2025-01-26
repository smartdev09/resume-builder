"use server"

import { auth } from "utils/auth";
import { prisma } from "@resume/db";
import { del } from "@vercel/blob"
import { revalidatePath } from "next/cache";

export async function deleteResume(id: string){
    const session = await auth();

    if(!session?.user) {
        throw new Error("User not authenticated")
    }
    
    const resume = await prisma.resume.findUnique({
        where: {
            id, 
            userid: session?.user?.id
        }
    })

    if(!resume) throw new Error("Resume not found")

    if(resume.photoUrl) {
        await del(resume.photoUrl)
    }

    await prisma.resume.delete({
        where: {
            id
        }
    })

    revalidatePath("/resumes")
}