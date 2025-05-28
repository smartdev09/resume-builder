import { NextResponse } from "next/server";
import { createDeepSeek } from '@ai-sdk/deepseek';
import { streamText } from "ai";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

export async function POST(request: Request) {
  try {
    const { prompt }: { prompt: string } = await request.json();

    const result = streamText({
      model: deepseek('deepseek-chat'),
      prompt: prompt,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("Error generating review:", error);
    return NextResponse.json(
      { error: "Failed to generate review", details: String(error) },
      { status: 500 }
    );
  }
}