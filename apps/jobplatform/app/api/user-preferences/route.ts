import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@resume/db";

// Save user job preferences from onboarding
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication when NextAuth is set up
    // For now, we'll use a hardcoded user email or skip authentication
    
    const body = await request.json();
    const { jobFunction, jobType, location, openToRemote, needsSponsorship, userEmail } = body;

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    // First, find the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      // Create a new user if they don't exist
      const newUser = await prisma.user.create({
        data: {
          email: userEmail,
          name: userEmail.split('@')[0] // Use email prefix as name
        }
      });
      
      // Create preferences for new user
      const preferences = await prisma.userJobPreferences.create({
        data: {
          userId: newUser.id,
          jobFunction,
          jobType,
          location,
          openToRemote: Boolean(openToRemote),
          needsSponsorship: Boolean(needsSponsorship),
          isActive: true
        }
      });

      return NextResponse.json({ 
        success: true, 
        preferences,
        message: "User created and job preferences saved successfully" 
      });
    }

    // Deactivate any existing preferences
    await prisma.userJobPreferences.updateMany({
      where: { userId: user.id },
      data: { isActive: false }
    });

    // Create new preferences
    const preferences = await prisma.userJobPreferences.create({
      data: {
        userId: user.id,
        jobFunction,
        jobType,
        location,
        openToRemote: Boolean(openToRemote),
        needsSponsorship: Boolean(needsSponsorship),
        isActive: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      preferences,
      message: "Job preferences saved successfully" 
    });

  } catch (error) {
    console.error("Error saving user preferences:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}

// Get user job preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ 
        preferences: null,
        message: "User not found" 
      });
    }

    // Get active preferences
    const preferences = await prisma.userJobPreferences.findFirst({
      where: { 
        userId: user.id,
        isActive: true 
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      preferences: preferences || null
    });

  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
} 