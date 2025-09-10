import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { jobDescription } = await request.json();

        if (!jobDescription) {
            return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: "You are an expert career coach and technical recruiter. Analyze job descriptions and extract critical information for a candidate."
                },
                {
                    role: "user",
                    content: `Analyze the following job description. 
          1. Extract the top 3-5 most critical hard skills/keywords (e.g. 'React', 'AWS', 'Python').
          2. Provide 3 specific, actionable tips on what the candidate should highlight in their resume to get an interview.
          
          Return the response in strictly valid JSON format like this:
          {
            "keywords": ["Skill1", "Skill2"],
            "tips": ["Tip 1", "Tip 2"]
          }
          
          Job Description:
          ${jobDescription.substring(0, 3000)}`
                    // Truncate to avoid token limits just in case, though 3k chars is usually fine.
                }
            ],
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content returned from OpenAI");

        const analysis = JSON.parse(content);

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return NextResponse.json({ error: 'Failed to analyze job description' }, { status: 500 });
    }
}
