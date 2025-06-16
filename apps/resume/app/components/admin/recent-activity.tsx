import { formatDistanceToNow } from "date-fns";
import { User, UserPlus } from "lucide-react";

async function fetchRecentActivity() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/analytics`, {
      cache: 'no-store', // Ensure fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    
    const data = await response.json();
    return data.recentActivity || [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

export async function RecentActivity() {
  try {
    const activities = await fetchRecentActivity();

    if (activities.length === 0) {
      return (
        <div className="text-center py-6">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {activities.map((activity: any) => (
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