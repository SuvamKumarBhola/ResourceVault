import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Resource } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Bot, AlignLeft, Tag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { db } from "@/database/db";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ResourceDetailSheetProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResourceDetailSheet({ resource, open, onOpenChange }: ResourceDetailSheetProps) {
  const [notes, setNotes] = useState("");

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

  if (!resource) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col p-0 border-l border-border bg-background">
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

            <div className="space-y-3">
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
