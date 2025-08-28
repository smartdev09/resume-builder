import { Card, CardContent, CardHeader, CardTitle } from "@resume/ui/card";
import { Users, FileText, Activity, Database } from "lucide-react";
import { supabase } from "node_modules/@resume/db/supabaseClient";
async function fetchAnalytics() {
 
 try{

      // 1. Total users
      const { count:totalUsers, error:userError } = await supabase
    .from("users")
    .select("email", { count: "exact", head: true });
      if (userError) throw userError;
      // 2. Total resumes
      const { count: totalResumes, error: resumeError } = await supabase
        .from("resumes")
        .select("id", { count: "exact", head: true });
  
      if (resumeError) throw resumeError;
  
      // 3. Recent users (last 30 days)
const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

const { count:recentUsers, error } = await supabase
  .from('users')
  .select('id', { count: 'exact', head: true })
  .gte('created_at', last30Days);
   
  
    if (error) {
      console.error("Admin API error:", error.message);
      return null;
    }
  
 
  
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

 }
 

}
export async function DashboardStats() {
  const analytics = await fetchAnalytics();
  // Fallback stats if API fails
  const stats = [
    {
      title: "Total Users",
      value: analytics?.totalUsers?.toLocaleString() || "0",
      description: "Registered users",
      icon: Users,
    },
    {
      title: "Total Resumes",
      value: analytics?.totalResumes?.toLocaleString() || "0",
      description: "Created resumes",
      icon: FileText,
    },
    {
      title: "Recent Users",
      value: analytics?.recentUsers?.toLocaleString() || "0",
      description: "Last 30 days",
      icon: Activity,
    },
    {
      title: "Active Users",
      value: analytics?.activeUsers?.toLocaleString() || "0",
      description: "Last 7 days",
      icon: Database,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 