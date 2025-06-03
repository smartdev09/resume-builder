import { streamText } from 'ai';
import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";

// Model configuration - easily swappable
const getModel = () => {
  // Default to Groq, but can easily switch to OpenAI or other providers
  if (process.env.GROQ_API_KEY) {
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });
    return groq("llama3-70b-8192");
  } else if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    return openai("gpt-4o-mini");
  } else {
    throw new Error("No AI provider API key found");
  }
};

export async function POST(req: Request) {
  try {
    const { 
      jobDescription, 
      selectedSkills = [], 
      currentResume = {},
      experienceLevel = "mid"
    } = await req.json();

    if (!jobDescription || selectedSkills.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Job description and selected skills are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert ATS-optimized resume writer and career consultant.

Your task is to generate an ATS-compliant resume based on:
1. Job description requirements
2. Selected skills to emphasize
3. Existing resume data (if provided)
4. Experience level

Generate ONLY a valid JSON object with this exact structure:

{
  "summary": "Professional summary tailored to the job (2-3 sentences, keyword-rich)",
  "skillSections": [
    {
      "name": "Frontend Technologies",
      "skills": ["React", "TypeScript", "JavaScript"],
      "order": 0
    },
    {
      "name": "Backend Technologies", 
      "skills": ["Node.js", "Python"],
      "order": 1
    }
  ],
  "workExperiences": [
    {
      "company": "Tech Company",
      "position": "Software Engineer",
      "startDate": "2022-01",
      "endDate": "2024-01",
      "location": "San Francisco, CA",
      "description": "• Developed scalable web applications using React and TypeScript\n• Improved application performance by 40% through optimization\n• Collaborated with cross-functional teams to deliver features"
    }
  ],
  "projects": [
    {
      "project": "E-commerce Platform",
      "technologies": "React, Node.js, MongoDB",
      "startDate": "2023-01",
      "endDate": "2023-06",
      "description": "• Built full-stack e-commerce platform with React frontend\n• Implemented secure payment processing with Stripe\n• Achieved 99.9% uptime with proper error handling"
    }
  ]
}

ATS Optimization Rules:
- Use action verbs (developed, implemented, optimized, led, etc.)
- Include quantified achievements with numbers/percentages where possible
- Remove personal pronouns (I, my, we, our)
- Use keywords from the job description naturally
- Keep bullet points concise but impactful
- Ensure skills match job requirements
- Organize skills into logical categories

Experience Level Guidelines:
- entry: 0-2 years, focus on education, projects, internships
- mid: 2-5 years, balance of experience and growth
- senior: 5+ years, leadership, architecture, mentoring
- lead: 8+ years, strategic impact, team management`;

    const userMessage = `Job Description:
${jobDescription}

Selected Skills to Emphasize:
${selectedSkills.join(', ')}

Experience Level: ${experienceLevel}

Current Resume Data:
${JSON.stringify(currentResume, null, 2)}

Generate an ATS-optimized resume that perfectly matches this job description while incorporating the selected skills and enhancing any existing information.`;

    const model = getModel();

    const result = streamText({
      model: model,
      system: systemPrompt,
      prompt: userMessage,
      temperature: 0.4, // Slightly higher for more creative content generation
      maxTokens: 2000
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Error in resume generation:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate resume' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 