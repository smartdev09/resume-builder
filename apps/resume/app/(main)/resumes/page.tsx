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
interface WorkExperience {
  id: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}
// Define the final shape of the returned resume data
export interface FormattedResumeData {
    id: string;
    title: string;
    description: string | null;
    photo: string | null; // Corresponds to photoUrl in the schema
    firstName: string | null;
    lastName: string | null;
    jobTitle: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    email: string | null;
    workExperiences: WorkExperience[];
}
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
//let resumes:FormattedResumeData[]
  //@ts-ignore
const resumes=await getResumes(user.id)
  //const {data:resumes,error:resumesError}=await getResumes(user.id)

  // if (resumesError) {
  //   console.error("Error fetching resumes:", resumesError.message);
  // }
  //get total count of all resumes
const totalCount=await getCount(user.id)



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
  