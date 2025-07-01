import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@resume/db";
import { getCurrentUserFromRequest } from "@/lib/auth-utils";

// Save job interaction (like, apply, save external)
export async function POST(request: NextRequest) {
  console.log("📝 Job interactions POST called");
  
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
    const { jobId, interactionType, notes } = body;

    console.log("📋 Request data:", { jobId, interactionType, hasNotes: !!notes });

    if (!jobId || !interactionType) {
      console.log("❌ Missing required fields");
      return NextResponse.json({ 
        error: "Job ID and interaction type are required" 
      }, { status: 400 });
    }

    console.log("🔍 Finding or creating user in database...");
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: currentUser.email }
    });

    if (!user) {
      console.log("👤 Creating new user in database");
      user = await prisma.user.create({
        data: {
          email: currentUser.email,
          name: currentUser.email.split('@')[0]
        }
      });
    }

    console.log("✅ User found/created:", { userId: user.id, email: user.email });

    // Check if interaction already exists (prevent duplicates)
    const existingInteraction = await prisma.jobInteraction.findUnique({
      where: {
        userId_jobId_interactionType: {
          userId: user.id,
          jobId: parseInt(jobId),
          interactionType: interactionType.toUpperCase()
        }
      }
    });

    if (existingInteraction) {
      console.log("ℹ️ Interaction already exists");
      return NextResponse.json({ 
        success: true,
        interaction: existingInteraction,
        message: "Interaction already exists" 
      });
    }

    console.log("💾 Creating new interaction...");
    // Create new interaction
    const interaction = await prisma.jobInteraction.create({
      data: {
        userId: user.id,
        jobId: parseInt(jobId),
        interactionType: interactionType.toUpperCase(),
        notes: notes || null,
        appliedAt: interactionType.toUpperCase() === 'APPLIED' ? new Date() : null
      }
    });

    console.log("✅ Interaction created successfully:", { 
      interactionId: interaction.id, 
      type: interaction.interactionType 
    });

    return NextResponse.json({ 
      success: true, 
      interaction,
      message: "Job interaction saved successfully" 
    });

  } catch (error) {
    console.error("❌ Error saving job interaction:", error);
    return NextResponse.json(
      { error: "Failed to save job interaction" },
      { status: 500 }
    );
  }
}

// Get user job interactions
export async function GET(request: NextRequest) {
  console.log("📄 Job interactions GET called");
  
  try {
    console.log("🔍 Getting current user from request...");
    // Get user from session
    const currentUser = await getCurrentUserFromRequest(request);
    
    console.log("👤 Current user:", { hasUser: !!currentUser, email: currentUser?.email });
    
    if (!currentUser || !currentUser.email) {
      console.log("❌ Authentication failed - no user or email");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const interactionType = searchParams.get('type');

    console.log("📋 Query params:", { interactionType });

    console.log("🔍 Finding user in database...");
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: currentUser.email }
    });

    if (!user) {
      console.log("❌ User not found in database");
      return NextResponse.json({ 
        interactions: [],
        message: "User not found" 
      });
    }

    console.log("✅ User found:", { userId: user.id, email: user.email });

    // Build query filter
    const where: any = { userId: user.id };
    if (interactionType) {
      where.interactionType = interactionType.toUpperCase();
    }

    console.log("📋 Fetching interactions with filter:", where);

    // Get interactions with job details
    const interactions = await prisma.jobInteraction.findMany({
      where,
      include: {
        job: true // Include the full job details
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log("✅ Interactions fetched:", { count: interactions.length });

    return NextResponse.json({ 
      interactions 
    });

  } catch (error) {
    console.error("❌ Error fetching job interactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch job interactions" },
      { status: 500 }
    );
  }
}

// Delete job interaction
export async function DELETE(request: NextRequest) {
  console.log("🗑️ Job interactions DELETE called");
  
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
    const { jobId, interactionType } = body;

    console.log("📋 Request data:", { jobId, interactionType });

    if (!jobId || !interactionType) {
      console.log("❌ Missing required fields");
      return NextResponse.json({ 
        error: "Job ID and interaction type are required" 
      }, { status: 400 });
    }

    console.log("🔍 Finding user in database...");
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: currentUser.email }
    });

    if (!user) {
      console.log("❌ User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ User found:", { userId: user.id, email: user.email });

    console.log("🗑️ Deleting interaction...");
    // Delete the interaction
    const deletedInteraction = await prisma.jobInteraction.delete({
      where: {
        userId_jobId_interactionType: {
          userId: user.id,
          jobId: parseInt(jobId),
          interactionType: interactionType.toUpperCase()
        }
      }
    });

    console.log("✅ Interaction deleted successfully:", { 
      interactionId: deletedInteraction.id,
      type: deletedInteraction.interactionType 
    });

    return NextResponse.json({ 
      success: true,
      deletedInteraction,
      message: "Job interaction removed successfully" 
    });

  } catch (error) {
    console.error("❌ Error deleting job interaction:", error);
    return NextResponse.json(
      { error: "Failed to delete job interaction" },
      { status: 500 }
    );
  }
} 