import { NextRequest, NextResponse } from "next/server";
import { pipeline, env } from "@xenova/transformers";
import nlp from "compromise";

// Ensure transformers doesn't try to use the browser cache or wasm in Node environment
// when running on the server.
env.allowLocalModels = false; 

// Keep pipelines in memory to avoid reloading models on every request
class PipelineSingleton {
  static summarizer: any = null;
  static classifier: any = null;

  static async getSummarizer() {
    if (this.summarizer === null) {
      console.log("Loading summarization model (Xenova/distilbart-cnn-6-6)...");
      this.summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-6-6");
    }
    return this.summarizer;
  }

  static async getClassifier() {
    if (this.classifier === null) {
      console.log("Loading classification model (Xenova/mobilebert-uncased-mnli)...");
      this.classifier = await pipeline("zero-shot-classification", "Xenova/mobilebert-uncased-mnli");
    }
    return this.classifier;
  }
}

const CATEGORIES = [
  "AI", "Frontend", "Backend", "DevOps", 
  "Machine Learning", "Research", "Career", 
  "Interview", "Open Source"
];

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content || content.trim().length < 10) {
       return NextResponse.json({ 
        summary: "Not enough content to analyze.", 
        tags: ["general"], 
        category: "Uncategorized" 
      });
    }

    const summarizer = await PipelineSingleton.getSummarizer();
    const classifier = await PipelineSingleton.getClassifier();

    // 1. Summarization
    const truncatedContent = content.substring(0, 3000); 
    const summaryResult = await summarizer(truncatedContent, {
      max_new_tokens: 100,
      min_new_tokens: 20,
    });
    
    let summary = summaryResult[0]?.summary_text || "Could not generate summary.";
    summary = summary.trim();

    // 2. Classification
    const classResult = await classifier(summary || truncatedContent.substring(0, 500), CATEGORIES);
    
    let category = "Other";
    if (classResult.labels && classResult.scores && classResult.scores[0] > 0.2) {
       category = classResult.labels[0]; // Highest scoring label
    }

    // 3. Tagging using Compromise
    const doc = nlp(content.substring(0, 2000));
    const nouns = (doc.nouns().out('array') as string[]) || [];
    let extractedTags = Array.from(new Set(nouns.map(n => n.toLowerCase().trim()))).slice(0, 5);    
    // Filter out very common/short words or numbers
    extractedTags = extractedTags.filter((t: string) => t.length > 2 && !/^\d+$/.test(t));
    if (extractedTags.length === 0) {
      extractedTags = ["general"];
    }

    return NextResponse.json({
      summary,
      tags: extractedTags,
      category
    });

  } catch (error: any) {
    console.error("Local AI Processing Error:", error);
    return NextResponse.json({ 
      summary: "Local AI processing failed.", 
      tags: ["error"], 
      category: "Uncategorized",
      error: error.message
    }, { status: 500 });
  }
}
