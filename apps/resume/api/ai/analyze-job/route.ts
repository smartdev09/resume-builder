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
    const { jobDescription, currentSkills = [] } = await req.json();

    if (!jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Job description is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert job requirements analyzer and skills matcher.

Your task is to analyze a job description and extract:
1. Required skills and technologies
2. Optional/preferred skills
3. Experience requirements
4. Key responsibilities
5. Match against candidate's current skills

Return ONLY a valid JSON object with this exact structure:

{
  "extractedSkills": [
    {
      "skill": "React",
      "required": true,
      "importance": "high",
      "category": "frontend"
    },
    {
      "skill": "AWS",
      "required": false,
      "importance": "medium", 
      "category": "cloud"
    }
  ],
  "experienceLevel": "senior",
  "keyRequirements": [
    "5+ years of frontend development",
    "Experience with React and TypeScript"
  ],
  "matchAnalysis": {
    "totalSkills": 8,
    "matchingSkills": 5,
    "missingCritical": ["Node.js", "AWS"],
    "strengths": ["React", "TypeScript"]
  }
}

Skills importance: "high", "medium", "low"
Categories: "frontend", "backend", "database", "cloud", "devops", "mobile", "other"
Experience levels: "entry", "mid", "senior", "lead"

Be thorough but focus on technical skills. Do not include soft skills like "communication" or "teamwork".`;

    const userMessage = `Job Description:
${jobDescription}

Current Candidate Skills:
${currentSkills.join(', ')}

Analyze this job description and provide the skill extraction and matching analysis.`;

    const model = getModel();

    const result = streamText({
      model: model,
      system: systemPrompt,
      prompt: userMessage,
      temperature: 0.3, // Lower temperature for more consistent JSON output
      maxTokens: 1500
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Error in job analysis:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze job description' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 