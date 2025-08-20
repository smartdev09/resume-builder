import { Metadata } from "next";
import NewResumeEditor from "./NewResumeEditor";
import { SidebarProvider, SidebarInset } from "@resume/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { redirect } from "next/navigation";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { supabase } from "node_modules/@resume/db/supabaseClient";
interface PageProps {
  searchParams: { resumeId?: string };
}

export const metadata: Metadata = {
  title: "Build your resume",
};
import { createClient } from "node_modules/@resume/db/supabaseServer";
export default async function Home({ searchParams }: PageProps) {
  const { resumeId } =await searchParams;

  // Await cookies() here
// const supabase = createRouteHandlerClient({
//   cookies: () => cookies(),  // function returning the cookies promise
// });
const supabase=await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
console.log(`(editor>:)${user}`)
  if (error || !user) {
    console.log(error);
    redirect("/sign-in"); // No need to throw after redirect
  }

  let resumeToEdit = null;

  if (resumeId) {
    const { data, error } = await supabase
      .from("resumes")
      .select(
        `
        *,
        work_experiences(*),
        educations(*),
        projects(*),
        skill_sections(*)
      `
      )
      .eq("id", resumeId)
      // .eq("userid", user.id)
      .single();

    if (error) throw error;
    resumeToEdit = data;
  }

  console.log("resumeToEdit", resumeToEdit);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NewResumeEditor resumeToEdit={resumeToEdit} />
      </SidebarInset>
    </SidebarProvider>
  );
}
