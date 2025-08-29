// app/api/slack/route.ts
import { NextRequest, NextResponse } from "next/server";

interface SlackMessageFormat {
    message: string;
    email: string;
}

export async function POST(req: NextRequest) {
    try {
        const url = 'https://slack.com/api/chat.postMessage'; // Use the correct base URL

        const body = await req.json(); // Get the body of the incoming request

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.SLACK_BEARER_TOKEN}`
            },
            body: JSON.stringify({ channel: 'resume-builder', text: body.message }), // Use the message from the request body
        });

        const json = await response.json();

        // Corrected: Always return a NextResponse
        if (!json.ok) {
            return NextResponse.json({ message: 'Failed to send message to Slack' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error in Slack API route:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}