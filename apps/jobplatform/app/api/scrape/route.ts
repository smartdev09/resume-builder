import { prisma } from "@resume/db";
import { NextResponse } from "next/server";
export async function GET() {
    const scrapedJobs = await prisma.scraped_jobs.findMany();
    return NextResponse.json(scrapedJobs);
}
