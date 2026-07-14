import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Resource } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Bot, AlignLeft, Tag, Heart, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { db } from "@/database/db";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLiveQuery } from "dexie-react-hooks";

interface ResourceDetailSheetProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResourceDetailSheet({ resource: initialResource, open, onOpenChange }: ResourceDetailSheetProps) {
  const [notes, setNotes] = useState("");

  // Keep the resource updated in real-time from the DB
  const resource = useLiveQuery(
    async () => {
      if (!initialResource) return null;
      const res = await db.resources.get(initialResource.id);
      return res || null;
    },
    [initialResource?.id]
  ) || initialResource;

  useEffect(() => {
    if (resource) {
      setNotes(resource.notes || "");
    }
  }, [resource]);

  const handleSaveNotes = async () => {
    if (resource) {
      await db.resources.update(resource.id, { notes, updatedAt: Date.now() });
    }
  };

  const handleToggleFavorite = async () => {
    if (resource) {
      await db.resources.update(resource.id, { isFavorite: !resource.isFavorite, updatedAt: Date.now() });
    }
  };

  const handleExportMarkdown = () => {
    if (!resource) return;
    let content = `# ${resource.title}\n\n`;
    if (resource.url) content += `**Source:** [${resource.url}](${resource.url})\n\n`;
    if (resource.category) content += `**Category:** ${resource.category}\n`;
    if (resource.tags && resource.tags.length > 0) content += `**Tags:** ${resource.tags.join(', ')}\n\n`;
    
    content += `## AI Summary\n${resource.summary || "None"}\n\n`;
    
    if (resource.notes) content += `## Personal Notes\n${resource.notes}\n\n`;
    
    if (resource.content) content += `## Extracted Content\n${resource.content}\n\n`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!resource) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col p-0 border-l border-border bg-background">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportMarkdown} className="h-8 rounded-md bg-background">
              <Download className="w-4 h-4 mr-2" />
              Export .md
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggleFavorite} 
              className={`h-8 rounded-md bg-background ${resource.isFavorite ? 'text-rose-500 hover:text-rose-600' : 'text-muted-foreground'}`}
            >
              <Heart className="w-4 h-4 mr-2" fill={resource.isFavorite ? "currentColor" : "none"} />
              {resource.isFavorite ? "Favorited" : "Favorite"}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <SheetHeader className="mb-6 space-y-4 text-left">
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                <Badge variant="outline" className="rounded-radius-badges bg-vellum text-ink capitalize">
                  {resource.type}
                </Badge>
                {resource.category && resource.category !== "Uncategorized" && (
                   <Badge variant="secondary" className="rounded-radius-badges bg-buttercup text-ochre">
                     {resource.category}
                   </Badge>
                )}
              </div>
              {resource.type === 'link' && resource.url && (
                <a href={resource.url} target="_blank" rel="noreferrer" className="text-blueprint hover:underline flex items-center gap-1 text-sm font-medium">
                  Open Original <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <SheetTitle className="font-heading text-2xl leading-tight">
              {resource.title}
            </SheetTitle>
            {resource.url && (
              <SheetDescription className="text-sm text-ash break-all">
                {resource.url}
              </SheetDescription>
            )}
          </SheetHeader>

          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink uppercase tracking-wider">
                <Bot className="w-4 h-4 text-blueprint" />
                AI Summary
              </h3>
              <div className="bg-muted/50 p-4 rounded-radius-cards text-sm text-slate leading-relaxed border border-border/50">
                {resource.summary || "No summary available."}
              </div>
            </div>

            {resource.tags && resource.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink uppercase tracking-wider">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map(tag => (
                    <span key={tag} className="text-xs font-mono text-slate bg-border/40 px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink uppercase tracking-wider">
                <AlignLeft className="w-4 h-4 text-ochre" />
                Extracted Content
              </h3>
              <div className="bg-background border border-border p-4 rounded-radius-cards">
                <ScrollArea className="h-[200px] w-full text-sm text-slate">
                  <p className="whitespace-pre-wrap">{resource.content || "No content extracted."}</p>
                </ScrollArea>
              </div>
            </div>

            <div className="space-y-3 pb-8">
              <Label className="text-sm font-semibold text-ink uppercase tracking-wider">Personal Notes</Label>
              <Textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your thoughts, takeaways, or connections here..."
                className="min-h-[150px] rounded-radius-cards resize-none"
              />
              <Button onClick={handleSaveNotes} className="w-full rounded-radius-buttons-pill bg-graphite text-chalk">
                Save Notes
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
