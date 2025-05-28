import { NextRequest, NextResponse } from "next/server";

interface SlackMessageFormat  {
    message: string;
    email: string;
}

export  async function POST(req:NextRequest, res:NextResponse) {

const url = 'https://slack.com/api/chat.postMessage?channel=resume-builder&text=daasd&pretty=1';

    const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SLACK_BEARER_TOKEN}`
        },
        body: JSON.stringify({ channel: 'resume-builder', text: req.body }),
      });

    const json =await response.json();

    if(!json.ok) return; 

    return NextResponse.json({
        status: 200
    })

}