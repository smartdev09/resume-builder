import { Card, CardContent, CardHeader, CardTitle } from "@resume/ui/card";
import { Users, FileText, Activity, Database } from "lucide-react";

async function fetchAnalytics() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/analytics`, {
      cache: 'no-store', // Ensure fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
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