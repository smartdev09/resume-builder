import { Button } from "@resume/ui/button";
import prisma from "utils/prisma";
import { resumeDataIncludes } from "utils/types";
import { PlusSquare } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ResumeItem from "./ResumeItem";
import { auth } from "utils/auth";

export const metadata: Metadata = {
  keywords: [
    'Resume builder',
    'Free resume builder',
    'Ai resume builder',
    'Resume builder free',
  ],
  title: 'Resume builder',
}

export default async function Home() {

  const session = await auth();

  const [resumes, totalCount] = await Promise.all([
    prisma.resume.findMany({
      where: {
        userid: session?.user?.id,
      },
      orderBy: {
        updatedAt: 'desc'
      },
      include: resumeDataIncludes
    }),
    prisma.resume.count({
      where: {
        userid: session?.user?.id
      }
    })
  ])
  
  return (
    <main className="max-w-7xl mx-auto w-full px-3 py-6 space-y-6">
      <div className="flex justify-end">
        <Button asChild className="flex w-fit gap-2">
            <Link href="/editor">
              <PlusSquare className="size-5" />
                New resume
            </Link>
        </Button>
      </div>
      <div className="space-y-1">
       
        <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3">
          {resumes.map(resume => (
              <ResumeItem key={resume.id} resume={resume} />
          ))}
        </div>
      </div>
    </main>
  );
}
  