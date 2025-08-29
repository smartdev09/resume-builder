import { Button } from "@resume/ui/button";
import { prisma } from "@resume/db";
import { resumeDataIncludes } from "utils/types";
import { PlusSquare } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ResumeItem from "./ResumeItem";
import {createClient} from '@resume/db/supabaseServer'
export const metadata: Metadata = {
  keywords: [
    'Resume builder',
    'Free resume builder',
    'Ai resume builder',
    'Resume builder free',
  ],
  title: 'Resume builder',
}
import { redirect } from "next/navigation";
import {getCount,
  getResumes
} from '@resume/db/resume'

export default async function Home() {
 const supabase = await createClient();

  // ✅ Check auth with getUser()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError.message);
    redirect("sign-in");
  }

  if (!user) {
    redirect("sign-in");
  }

  // ✅ Fetch resumes from Supabase 
  //@ts-ignore
  const {data:resumes,error:resumesError}=await getResumes(user.id)

  if (resumesError) {
    console.error("Error fetching resumes:", resumesError.message);
  }
  //get total count of all resumes
const totalCount=await getCount(user.id)


  console.log("resumes", resumes);

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
          {resumes && resumes.map((resume: any) => (
              <ResumeItem key={resume.id} resume={resume} />
          ))}
        </div>
      </div>
    </main>
  );
}
  