import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || url;
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
    
    $('script, style, noscript, iframe, img, svg').remove();
    const mainText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000);

    return NextResponse.json({ title, description, text: mainText });
  } catch (error: any) {
    console.error("URL Extraction Error:", error);
    return NextResponse.json({ error: error.message || "Failed to extract URL" }, { status: 500 });
  }
}
