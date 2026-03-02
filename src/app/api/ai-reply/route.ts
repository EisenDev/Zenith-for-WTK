import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });

export async function POST(req: Request) {
    try {
        const { review, tone } = await req.json();

        if (!process.env.GEMINI_AI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key not configured." },
                { status: 500 }
            );
        }

        const prompt = `
      You are a professional hotel manager at ZENITH Grand Resort. 
      Generate a response to the following guest review.
      
      Guest Name: ${review.guestName}
      Rating: ${review.rating}/5
      Source: ${review.source}
      Review: "${review.comment}"
      
      Tone to use: ${tone}
      
      Requirements:
      - If professional: Be formal, thank them for their time, and address points specifically.
      - If casual: Be friendly, warm, and approachable.
      - If apologetic: Sincere apology, offer to make it right, and maintain resort's prestige.
      - Keep it under 100 words.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate AI response." },
            { status: 500 }
        );
    }
}
