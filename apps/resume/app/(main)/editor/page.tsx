import { Metadata } from "next";
import NewResumeEditor from "./NewResumeEditor";
import { prisma } from "@resume/db";
import { auth } from "utils/auth";
import { resumeDataIncludes } from "utils/types";
import { SidebarProvider, SidebarInset } from "@resume/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { mapToResumeValues } from "utils/utils";
//import { toast } from "@resume/ui/sonner";

interface PageProps {
    searchParams: Promise<{ resumeId?: string }>
}

export const metadata: Metadata = {
    title: 'Build your resume'
}

export default async function Home({ searchParams } : PageProps) {
    const { resumeId } = await searchParams;

    const session = await auth();


  //   if(!session?.user) toast('Please login') 
    const resumeToEdit = resumeId ? 
        await prisma.resume.findUnique({
            where: { id: resumeId, userid: session?.user.id},
            include: resumeDataIncludes
        }) : null
        console.log('resumeToEdit', resumeToEdit)
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <NewResumeEditor resumeToEdit={resumeToEdit}/>
            </SidebarInset>
        </SidebarProvider>
    )
}