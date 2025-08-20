import { NextRequest, NextResponse } from "next/server";
import { supabase } from "node_modules/@resume/db/supabaseClient";

export async function GET() {
  try {
  

    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to create review", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
//const supabase =await createClient()


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const text = formData.get("text") as string;
    const rating = formData.get("rating") ? parseInt(formData.get("rating") as string) : 5;
    const displayName = formData.get("displayName") as string;
    const twitterHandle = formData.get("twitterHandle") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const pictureUrl = formData.get("pictureUrl") as string;

    if (!text) {
      return NextResponse.json({ error: "Missing required field: text" }, { status: 400 });
    }

    // Generate ID since schema requires it
    const id = crypto.randomUUID();

    const { data, error } = await supabase
      .from("reviews")
      .insert([{
        id,
        text,
        rating,
        displayName: displayName || null,
        twitterHandle: twitterHandle || null,
        linkedinUrl: linkedinUrl || null,
        pictureUrl: pictureUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select("*")
      .single();

    if (error) {
      throw error;
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log(error)
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

