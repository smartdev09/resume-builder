import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@resume/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const text = formData.get("text") as string;
    const rating = parseInt(formData.get("rating") as string);
    const displayName = formData.get("displayName") as string;
    const twitterHandle = formData.get("twitterHandle") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const pictureUrl = formData.get("pictureUrl") as string;

    console.log('Received form data:', {
      text,
      rating,
      displayName,
      twitterHandle,
      linkedinUrl,
      pictureUrl
    });

    if (!text || !rating) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const reviewData = {
      text,
      rating,
      displayName: displayName || null,
      twitterHandle: twitterHandle || null,
      linkedinUrl: linkedinUrl || null,
      pictureUrl: pictureUrl || null,
    };

    console.log('Creating review with data:', reviewData);

    const review = await prisma.review.create({
      data: reviewData
    });

    console.log('Review created:', review);
    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(reviews || []);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json([]);
  }
} 