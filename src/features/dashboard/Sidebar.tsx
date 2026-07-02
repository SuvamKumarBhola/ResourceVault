"use client";

import Link from "next/link";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/database/db";
import { useResourceStore } from "@/store/useResourceStore";
import { LayoutGrid, Bookmark, FolderOpen, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Sidebar() {
  const collections = useLiveQuery(() => db.collections.toArray(), []) || [];
  const activeCollectionId = useResourceStore((state) => state.activeCollectionId);
  const setActiveCollectionId = useResourceStore((state) => state.setActiveCollectionId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    await db.collections.add({
      id: crypto.randomUUID(),
      name: newCollectionName.trim(),
      isCustom: true,
      createdAt: Date.now()
    });

    setNewCollectionName("");
    setIsDialogOpen(false);
  };

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar h-screen flex flex-col hidden md:flex">
      <div className="p-4 flex items-center h-[72px]">
        <h1 className="text-sidebar-foreground font-heading font-bold text-lg">ResourceVault</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-1">
          <button 
            onClick={() => setActiveCollectionId(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeCollectionId === null ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
          >
            <LayoutGrid className="w-4 h-4" />
            All Resources
          </button>
        </div>
        
        <div>
          <div className="flex items-center justify-between px-3 py-2">
            <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">Collections</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger
                render={
                  <button className="text-sidebar-foreground/60 hover:text-sidebar-foreground" />
                }
              >
                <Plus className="w-4 h-4" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-radius-modals">
                <DialogHeader>
                  <DialogTitle className="font-heading text-xl">Create Collection</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCollection} className="space-y-4 mt-4">
                  <Input 
                    value={newCollectionName} 
                    onChange={e => setNewCollectionName(e.target.value)} 
                    placeholder="E.g. React Tutorials, Design Inspiration..." 
                    className="rounded-radius-cards"
                    autoFocus
                  />
                  <DialogFooter>
                    <Button type="submit" className="w-full rounded-radius-buttons-pill bg-graphite text-chalk hover:bg-graphite/90">
                      Create
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-1 mt-1">
            {collections.map(collection => (
              <button
                key={collection.id}
                onClick={() => setActiveCollectionId(collection.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeCollectionId === collection.id ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
              >
                <FolderOpen className="w-4 h-4" />
                {collection.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
