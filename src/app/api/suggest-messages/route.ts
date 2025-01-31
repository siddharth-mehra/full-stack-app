import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const DEFAULT_PROMPT = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.`;

export async function POST(request: Request) {
    if (!process.env.GEMINI_API_KEY) {
        return Response.json({ error: "Missing API key" }, { status: 500 });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(DEFAULT_PROMPT);
        const response = result.response.text();
        return new Response(
            JSON.stringify({ message: "Questions generated successfully", questions: response }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );;

    } catch (error) {
        console.error('Gemini API Error:', error);
        return Response.json({ 
            error: error instanceof Error ? error.message : "Generation failed",
            details: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}



