import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@resume/db";
import { getCurrentUserFromRequest } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  console.log("📝 User preferences POST called");
  
  try {
    console.log("🔍 Getting current user from request...");
    // Get user from session
    const currentUser = await getCurrentUserFromRequest(request);
    
    console.log("👤 Current user:", { hasUser: !!currentUser, email: currentUser?.email });
    
    if (!currentUser || !currentUser.email) {
      console.log("❌ Authentication failed - no user or email");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    console.log("📋 Parsing request body...");
    const body = await request.json();
    const { jobFunction, jobType, location, openToRemote, needsSponsorship } = body;

    console.log("📋 Preferences data:", { 
      jobFunction, 
      jobType, 
      location, 
      openToRemote, 
      needsSponsorship 
    });

    console.log("🔍 Finding or creating user in database...");
    const user = await prisma.user.findUnique({
      where: { email: currentUser.email }
    });

    if (!user) {
      console.log("👤 Creating new user in database");
      const newUser = await prisma.user.create({
        data: {
          email: currentUser.email,
          name: currentUser.email.split('@')[0]
        }
      });
      
      console.log("💾 Creating preferences for new user");
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

      console.log("✅ User and preferences created successfully:", { 
        userId: newUser.id, 
        preferencesId: preferences.id 
      });

      return NextResponse.json({ 
        success: true, 
        preferences,
        message: "User created and job preferences saved successfully" 
      });
    }

    console.log("✅ User found, updating preferences");

    console.log("🔄 Deactivating old preferences");
    await prisma.userJobPreferences.updateMany({
      where: { userId: user.id },
      data: { isActive: false }
    });

    console.log("💾 Creating new preferences");
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

    console.log("✅ Preferences saved successfully:", { 
      userId: user.id, 
      preferencesId: preferences.id 
    });

    return NextResponse.json({ 
      success: true, 
      preferences,
      message: "Job preferences saved successfully" 
    });

  } catch (error) {
    console.error("❌ Error saving user preferences:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log("📄 User preferences GET called");
  
  try {
    console.log("🔍 Getting current user from request...");
    // Get user from session
    const currentUser = await getCurrentUserFromRequest(request);
    
    console.log("👤 Current user:", { hasUser: !!currentUser, email: currentUser?.email });
    
    if (!currentUser || !currentUser.email) {
      console.log("❌ Authentication failed - no user or email");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.log("🔍 Finding user in database...");
    const user = await prisma.user.findUnique({
      where: { email: currentUser.email }
    });

    if (!user) {
      console.log("❌ User not found in database");
      return NextResponse.json({ 
        preferences: null,
        message: "User not found" 
      });
    }

    console.log("✅ User found:", { userId: user.id, email: user.email });

    console.log("📋 Fetching active preferences");
    const preferences = await prisma.userJobPreferences.findFirst({
      where: { 
        userId: user.id,
        isActive: true 
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log("✅ Preferences fetched:", { 
      hasPreferences: !!preferences,
      preferencesId: preferences?.id 
    });

    return NextResponse.json({ 
      preferences: preferences || null
    });

  } catch (error) {
    console.error("❌ Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
} 