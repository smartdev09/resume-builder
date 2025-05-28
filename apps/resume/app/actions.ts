

"use server"

import { auth } from "utils/auth";
import { prisma } from "@resume/db";
import { resumeSchema, ResumeValues } from "utils/validations";
import { del, put } from "@vercel/blob";
import path from "path";
import { NextResponse } from "next/server";

interface SlackMessageFormat  {
    message: string;
    email: string;
}

export async function postToSlack(message: SlackMessageFormat) {
    console.log(message)
    const url = 'https://slack.com/api/chat.postMessage?channel=resume-builder&text=daasd&pretty=1';

    const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer xoxb-7072631420658-8466987379457-XRywlo6Y2xrldaFzJruWe2KF"
        },
        body: JSON.stringify({ channel: 'resume-builder', text: message }),
      });

    const json =await response.json();

    if(!json.ok) return; 

    return NextResponse.json({
        status: 200
    })
}