import { NextRequest, NextResponse } from "next/server";
//import { createClient } from "@resume/db/supabaseServer";
import { createClient } from "node_modules/@resume/db/supabaseServer";

// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Server only, never expose to client
// );

export async function GET(request: NextRequest) {
  try {
   // const session = await auth();

    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
const supabase=await createClient()
console.log('auth:',await supabase.auth.getUser())
    // 1. Total users
    const { count: totalUsers, error: userError } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true });

    if (userError) throw userError;

    // 2. Total resumes
    const { count: totalResumes, error: resumeError } = await supabase
      .from("resumes")
      .select("id", { count: "exact", head: true });

    if (resumeError) throw resumeError;

    // 3. Recent users (last 30 days)
     const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    console.error("Admin API error:", error.message);
    return null;
  }

  // Filter users created in last 30 days
  const recentUsers = data.users.filter(
    (u) => new Date(u.created_at) >= new Date(last30Days)
  ).length;

    // 4. Active users (last 7 days updated)
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: activeUsers, error: activeError } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .gte("updatedAt", last7Days);

    if (activeError) throw activeError;

    // 5. Recent activity (latest 5 users)
    const { data: recentActivity, error: activityError } = await supabase
      .from("users")
      .select("id, name, email, createdAt")
      .order("createdAt", { ascending: false })
      .limit(5);

    if (activityError) throw activityError;

    const stats = {
      totalUsers,
      totalResumes,
      recentUsers,
      activeUsers,
      recentActivity: recentActivity?.map((user) => ({
        id: `user-${user.id}`,
        type: "user_joined",
        title: `${user.name || user.email} joined`,
        description: "New user registration",
        timestamp: user.createdAt,
      })) ?? [],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
