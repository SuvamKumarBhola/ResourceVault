"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { db } from "@/database/db";

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    await db.resources.add({
      id: crypto.randomUUID(),
      type: 'link',
      title: title,
      url: url,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    setUrl("");
    setTitle("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-radius-buttons-pill px-6 bg-graphite text-chalk hover:bg-graphite/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-radius-modals">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Save a link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. React Documentation" required className="rounded-radius-cards" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." required className="rounded-radius-cards" />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" className="rounded-radius-buttons-pill px-8 bg-graphite text-chalk">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
