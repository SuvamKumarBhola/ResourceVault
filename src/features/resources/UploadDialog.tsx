"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UploadCloud, Loader2 } from "lucide-react";
import { processResource } from "@/lib/pipeline/ingest";
import { usePipelineStore } from "@/store/usePipelineStore";

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isProcessing = usePipelineStore(state => state.isProcessing);
  const statusText = usePipelineStore(state => state.statusText);

  const handleUploadLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    try {
      await processResource(url, title);
      setUrl("");
      setTitle("");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to process link.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await processResource(file);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to process file.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isProcessing && setOpen(val)}>
      <DialogTrigger
        render={
          <Button className="rounded-radius-buttons-pill px-6 bg-graphite text-chalk hover:bg-graphite/90" />
        }
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Resource
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-radius-modals">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Save to Vault</DialogTitle>
        </DialogHeader>
        
        {isProcessing ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blueprint" />
            <p className="text-sm font-medium text-ink">{statusText}</p>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            <div 
              className="border-2 border-dashed border-border rounded-radius-cards p-8 flex flex-col items-center justify-center hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-ink font-medium">Upload Image or PDF</p>
              <p className="text-xs text-ash mt-1">Click or drag and drop</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or save a link</span>
              </div>
            </div>

            <form onSubmit={handleUploadLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." required className="rounded-radius-cards" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Leave blank to auto-extract" className="rounded-radius-cards" />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" className="w-full rounded-radius-buttons-pill bg-graphite text-chalk">Save Link</Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
