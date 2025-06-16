import { auth } from "utils/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "../../components/admin/admin-sidebar";
import { AdminHeader } from "../../components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is logged in and has admin role
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // For now, we'll allow all authenticated users - you can add role check later
  // if (session.user.role !== "admin") {
  //   redirect("/unauthorized");
  // }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 