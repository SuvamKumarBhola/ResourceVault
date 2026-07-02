"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/database/db";
import { useResourceStore } from "@/store/useResourceStore";
import { LayoutGrid, Bookmark, FolderOpen, Plus } from "lucide-react";

export function Sidebar() {
  const collections = useLiveQuery(() => db.collections.toArray(), []) || [];
  const activeCollectionId = useResourceStore((state) => state.activeCollectionId);
  const setActiveCollectionId = useResourceStore((state) => state.setActiveCollectionId);

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
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <Bookmark className="w-4 h-4" />
            Favorites
          </button>
        </div>
        
        <div>
          <div className="flex items-center justify-between px-3 py-2">
            <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">Collections</h2>
            <button className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <Plus className="w-4 h-4" />
            </button>
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
