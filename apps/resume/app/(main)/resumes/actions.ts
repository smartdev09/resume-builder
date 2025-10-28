// "use server"

// import { auth } from "utils/auth";
// import { prisma } from "@resume/db";
// import { del } from "@vercel/blob"
// import { revalidatePath } from "next/cache";

// export async function deleteResume(id: string){
//     const session = await auth();

//     if(!session?.user) {
//         throw new Error("User not authenticated")
//     }
    
//     const resume = await prisma.resume.findUnique({
//         where: {
//             id, 
//             userid: session?.user?.id
//         }
//     })

//     if(!resume) throw new Error("Resume not found")

//     if(resume.photoUrl) {
//         await del(resume.photoUrl)
//     }

//     await prisma.resume.delete({
//         where: {
//             id
//         }
//     })

//     revalidatePath("/resumes")
// }
"use server"

import {supabase} from '../../../../../packages/database/supabaseClient'
export async function deleteResume(id: string) {

  // 1. Get logged-in user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw new Error(authError.message);
  if (!user) throw new Error("User not authenticated");

  // 2. Find the resume by id and user_id
  const { data: resume, error: fetchError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!resume) throw new Error("Resume not found");

  // 3. Delete the photo from Supabase Storage (if it exists)
  if (resume.photo_url) {
    const { error: storageError } = await supabase.storage
      .from("resume-photos") // Your storage bucket name
      .remove([resume.photo_url]);

    if (storageError) throw new Error(storageError.message);
  }

  // 4. Delete the resume record from DB
  const { error: deleteError } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError) throw new Error(deleteError.message);

  // 5. Revalidate path
  // @ts-ignore
  import("next/cache").then(({ revalidatePath }) => {
    revalidatePath("/resumes");
  });
}
