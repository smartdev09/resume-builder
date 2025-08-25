import { redirect } from "next/navigation";
import { AdminSidebar } from "../../components/admin/admin-sidebar";
import { AdminHeader } from "../../components/admin/admin-header";
//import { supabase } from "node_modules/@resume/db/supabaseClient";
import { createClient } from "node_modules/@resume/db/supabaseServer";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase=await createClient()
 // const session = await auth();
const {data:{user},error}=await supabase.auth.getUser()
  // Check if user is logged in and has admin role
  // if (!session?.user) {
  //   redirect("/auth/signin");
  // }
if(!user){
console.error('(admin/layout.tsx:)no user found')
//redirect('/sign-in')
}
  // For now, we'll allow all authenticated users - you can add role check later
  // if (session.user.role !== "admin") {
  //   redirect("/unauthorized");
  // }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
{/* @ts-ignore */}
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 