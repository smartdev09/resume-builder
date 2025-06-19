import { NextRequest, NextResponse } from 'next/server';

// This is a placeholder API route for fetching job details by ID
// You'll need to replace this with your actual database query
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    
    // TODO: Replace this with actual database query
    // For now, we'll return a mock job or fetch from your existing jobs API
    
    // You might want to query your database like:
    // const job = await prisma.scrapedJob.findUnique({
    //   where: { id: parseInt(jobId) }
    // });
    
    // For demonstration, returning a mock response
    // In practice, you should fetch from your actual job storage
    const mockJob = {
      id: parseInt(jobId),
      job_id: `job_${jobId}`,
      site: "LinkedIn",
      job_url: "https://example.com/job",
      job_url_direct: "https://example.com/job",
      title: "Senior Software Engineer",
      company: "Tech Company",
      location: "San Francisco, CA",
      date_posted: new Date().toISOString(),
      job_type: "Full-time",
      is_remote: true,
      job_function: "Software Engineering",
      description: `**Position Title:**

Senior Software Engineer - React, Python, AWS

**Job Summary:**

We are seeking a highly skilled and self-driven Software Engineer with strong experience in **React**, **Python**, and **AWS** technologies. This role will be instrumental in designing, developing, and deploying scalable, cloud-based applications.

**Key Responsibilities:**

* Design, build, and maintain scalable, responsive web applications using **React** and **Python**
* Architect and implement backend services, APIs, and data models
* Develop and manage cloud infrastructure using **AWS** tools (Lambda, S3, API Gateway, DynamoDB, etc.)
* Write unit, integration, and E2E tests to ensure software quality
* Work closely with UI/UX designers and DevOps teams to deliver production-ready features

**Required Qualifications:**

* **3-5+ years** of experience as a software engineer
* Expertise in **React.js**, JavaScript/TypeScript
* Proficient in **Python** frameworks such as **FastAPI**, **Django**, or **Flask**
* Hands-on experience with **AWS services** for backend architecture and deployments`,
      company_industry: "Technology",
      company_logo: null,
      company_description: "A leading technology company focused on innovative solutions.",
      job_level: "Senior Level",
      matchScore: 85,
      matchReason: "Strong match for React and Python skills"
    };

    return NextResponse.json(mockJob);
  } catch (error) {
    console.error('Error fetching job details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
} 