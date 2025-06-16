import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@resume/db";
import { auth } from "utils/auth";

// GET /api/admin/analytics - Get dashboard analytics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get various statistics
    const [
      totalUsers,
      totalResumes,
      recentUsers,
      activeUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.resume.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    // Get recent activity (new users)
    const recentActivity = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const stats = {
      totalUsers,
      totalResumes,
      recentUsers,
      activeUsers,
      recentActivity: recentActivity.map(user => ({
        id: `user-${user.id}`,
        type: "user_joined",
        title: `${user.name || user.email} joined`,
        description: "New user registration",
        timestamp: user.createdAt,
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 