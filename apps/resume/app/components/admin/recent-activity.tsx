import { formatDistanceToNow } from "date-fns";
import { User, UserPlus } from "lucide-react";
//import { supabase } from "node_modules/@resume/db/supabaseClient";
import { supabase } from "node_modules/@resume/db/supabaseClient";

async function fetchRecentActivity() {
    try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/analytics`, {
      cache: 'no-store', // Ensure fresh data
    })
    try{
const {data:{user},error:authError}=await supabase.auth.getUser()
    // 1. Total users
    const { count: totalUsers, error: userError } = await supabase
      .from("auth.users")
      .select("id", { count: "exact", head: true });

    if (userError) throw userError;

    // 2. Total resumes
    const { count: totalResumes, error: resumeError } = await supabase
      .from("resumes")
      .select("id", { count: "exact", head: true });

    if (resumeError) throw resumeError;

    // 3. Recent users (last 30 days)
     const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Query auth.users table (system schema)
  const { count, error } = await supabase
    .from("auth.users") // system table
    .select("id", { count: "exact", head: true })
   //.gte("created_at", last30Days);

  if (error) {
    console.error("Error fetching recent users:", error.message);
    return null;
  }
let recentUsers=count

   // if (recentError) throw recentError;

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
    return stats

    }
   catch(e){
    console.log('error fetching recent activity')
   }
    
    //const data = await response.json();
    //data.recentActivity 
    return  [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

 export async function RecentActivity() {
  try {
    //@ts-ignore
    const {recentActivity:activities} = await fetchRecentActivity();
    //@ts-ignore
    if (activities?.length === 0) {
      return (
        <div className="text-center py-6">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      );
    }

     return (
      <div className="space-y-4">
       {/* @ts-ignore */}
        {activities?.map((activity: any) => (
          <div key={activity.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-accent-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.description} • {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error rendering recent activity:", error);
    return (
      <div className="text-center py-6">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Unable to load recent activity</p>
      </div>
    );
   }
} 