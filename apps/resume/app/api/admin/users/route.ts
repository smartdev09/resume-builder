import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@resume/db";
import { auth } from "utils/auth";

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Basic auth check (you can add role-based auth later)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET user stats
export async function HEAD() {
  try {
    const userCount = await prisma.user.count();
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    return new NextResponse(null, {
      status: 200,
      headers: {
        "X-Total-Users": userCount.toString(),
        "X-Recent-Users": recentUsers.toString(),
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return new NextResponse(null, { status: 500 });
  }
} 