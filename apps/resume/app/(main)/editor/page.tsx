import { Metadata } from "next";
import NewResumeEditor from "./NewResumeEditor";
import { SidebarProvider, SidebarInset } from "@resume/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { redirect } from "next/navigation";
import { createClient } from "@resume/db/supabaseServer"; // ✅ use alias, not node_modules import

export const metadata: Metadata = {
  title: "Build your resume",
};
// @ts-ignore
export default async function Home({searchParams,}: any) {
  // @ts-ignore
  //const { resumeId } = searchParams ?? {};

  const supabase = await createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
  // redirect("/sign-in");
  }

  let resumeToEdit = null;

  // if (resumeId) {
  //   const { data, error } = await supabase
  //     .from("resumes")
  //     .select(
  //       `
  //       *,
  //       work_experiences(*),
  //       educations(*),
  //       projects(*),
  //       skill_sections(*)
  //     `
  //     )
  //     .eq("id", resumeId)
  //     .single();

  //   if (error) throw error;
  //   resumeToEdit = data;
  // }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NewResumeEditor resumeToEdit={resumeToEdit} />
      </SidebarInset>
    </SidebarProvider>
  );
}
