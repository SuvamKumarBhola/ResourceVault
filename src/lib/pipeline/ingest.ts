import { db } from "@/database/db";
import { usePipelineStore } from "@/store/usePipelineStore";

export async function processResource(fileOrUrl: File | string, titleInput?: string) {
  const { setProcessing, updateProgress } = usePipelineStore.getState();
  setProcessing(true, "Detecting resource type...", 10);
  
  try {
    const isUrl = typeof fileOrUrl === 'string';
    const id = crypto.randomUUID();
    let title = titleInput || (isUrl ? fileOrUrl : fileOrUrl.name);
    let extractedText = "";
    let type: 'link' | 'image' | 'pdf' = 'link';
    let urlStr = isUrl ? fileOrUrl : undefined;

    if (isUrl) {
      updateProgress("Extracting webpage content...", 30);
      const res = await fetch('/api/extract/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fileOrUrl })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.title && !titleInput) title = data.title;
        
        const parts = [];
        if (data.title) parts.push(`Title: ${data.title}`);
        if (data.description) parts.push(`Description: ${data.description}`);
        if (data.text && data.text.trim().length > 10) parts.push(`Content: ${data.text.trim()}`);
        
        extractedText = parts.join('\n\n');
      }
    } else {
      if (fileOrUrl.type.startsWith('image/')) {
        type = 'image';
        updateProgress("Running local OCR...", 30);
        const Tesseract = (await import('tesseract.js')).default;
        const result = await Tesseract.recognize(fileOrUrl, 'eng');
        extractedText = result.data.text;
      } else {
        type = 'pdf';
        extractedText = "PDF parsing not implemented yet in this phase.";
      }
    }

    updateProgress("Generating AI summary and tags...", 60);
    const aiRes = await fetch('/api/ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: extractedText.substring(0, 5000), type })
    });
    
    let summary = "No summary generated.";
    let tags: string[] = [];
    let category = "Uncategorized";

    if (aiRes.ok) {
      const aiData = await aiRes.json();
      summary = aiData.summary || summary;
      tags = aiData.tags || tags;
      category = aiData.category || category;
    }

    updateProgress("Saving to vault...", 90);
    
    let fileData = null;
    if (!isUrl) {
      fileData = await fileOrUrl.arrayBuffer();
    }

    await db.resources.add({
      id,
      type,
      title,
      url: urlStr,
      content: extractedText,
      summary,
      tags,
      category,
      fileData,
      mimeType: !isUrl ? fileOrUrl.type : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    setProcessing(false);
    return id;
  } catch (error) {
    console.error("Ingestion failed:", error);
    setProcessing(false);
    throw error;
  }
}
