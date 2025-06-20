import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@resume/db";

// Save job interaction (like, apply, save external)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, jobId, interactionType, notes } = body;

    if (!userEmail || !jobId || !interactionType) {
      return NextResponse.json({ 
        error: "User email, job ID, and interaction type are required" 
      }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userEmail.split('@')[0]
        }
      });
    }

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
      return NextResponse.json({ 
        success: true,
        interaction: existingInteraction,
        message: "Interaction already exists" 
      });
    }

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

    return NextResponse.json({ 
      success: true, 
      interaction,
      message: "Job interaction saved successfully" 
    });

  } catch (error) {
    console.error("Error saving job interaction:", error);
    return NextResponse.json(
      { error: "Failed to save job interaction" },
      { status: 500 }
    );
  }
}

// Get user job interactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const interactionType = searchParams.get('type');

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ 
        interactions: [],
        message: "User not found" 
      });
    }

    // Build query filter
    const where: any = { userId: user.id };
    if (interactionType) {
      where.interactionType = interactionType.toUpperCase();
    }

    // Get interactions with job details
    const interactions = await prisma.jobInteraction.findMany({
      where,
      include: {
        job: true // Include the full job details
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      interactions 
    });

  } catch (error) {
    console.error("Error fetching job interactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch job interactions" },
      { status: 500 }
    );
  }
}

// Delete job interaction
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, jobId, interactionType } = body;

    if (!userEmail || !jobId || !interactionType) {
      return NextResponse.json({ 
        error: "User email, job ID, and interaction type are required" 
      }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    return NextResponse.json({ 
      success: true,
      deletedInteraction,
      message: "Job interaction removed successfully" 
    });

  } catch (error) {
    console.error("Error deleting job interaction:", error);
    return NextResponse.json(
      { error: "Failed to delete job interaction" },
      { status: 500 }
    );
  }
} 