import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export async function POST(req: NextRequest) {
  try {
    if (!ai) {
      return NextResponse.json({ 
        summary: "No API key configured. Add GEMINI_API_KEY to .env.local to enable AI features.", 
        tags: ["offline"], 
        category: "Uncategorized" 
      });
    }

    const { content, type } = await req.json();

    const prompt = `
      You are an intelligent knowledge organization assistant. 
      Analyze the following content from a ${type}.
      Provide a concise 2-sentence summary.
      Extract 3-5 relevant technical tags (lowercase).
      Predict a category from this list: [AI, Frontend, Backend, DevOps, Machine Learning, Research, Career, Interview, Open Source, Other].
      
      Content:
      ${content}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING }
          },
          required: ["summary", "tags", "category"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini");
    }

    const result = JSON.parse(response.text);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Processing Error:", error);
    return NextResponse.json({ 
      summary: "AI processing failed.", 
      tags: ["error"], 
      category: "Uncategorized" 
    }, { status: 500 });
  }
}
