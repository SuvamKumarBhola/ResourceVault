"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/database/db";
import { useResourceStore } from "@/store/useResourceStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Bot, MoreVertical, FolderPlus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { ResourceDetailSheet } from "./ResourceDetailSheet";
import { Resource } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu";

export function ResourceList() {
  const searchQuery = useResourceStore(state => state.searchQuery);
  const activeCollectionId = useResourceStore(state => state.activeCollectionId);

  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const resources = useLiveQuery(async () => {
    const all = await db.resources.orderBy('createdAt').reverse().toArray();
    return all.filter(r => {
      // Filter by collection
      if (activeCollectionId && r.collectionId !== activeCollectionId) return false;

      // Filter by search query
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const matchesSearch = r.title.toLowerCase().includes(q) || 
                            (r.url && r.url.toLowerCase().includes(q)) ||
                            (r.summary && r.summary.toLowerCase().includes(q)) ||
                            (r.tags && r.tags.some(t => t.toLowerCase().includes(q)));
      return matchesSearch;
    });
  }, [searchQuery, activeCollectionId]) || [];

  const collections = useLiveQuery(() => db.collections.toArray()) || [];

  const handleCardClick = (resource: Resource) => {
    setSelectedResource(resource);
    setIsSheetOpen(true);
  };

  const handleAssignCollection = async (resourceId: string, collectionId: string | undefined) => {
    await db.resources.update(resourceId, { collectionId, updatedAt: Date.now() });
  };

  const handleDelete = async (resourceId: string) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      await db.resources.delete(resourceId);
    }
  };

  if (resources.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate text-lg">No resources found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card 
              className="h-full flex flex-col rounded-radius-cards shadow-md hover:shadow-lg transition-all border-border bg-card cursor-pointer group"
              onClick={() => handleCardClick(resource)}
            >
              <CardHeader className="pb-2 flex-none">
                <div className="flex justify-between items-start mb-2">
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
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded-md hover:bg-muted text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <FolderPlus className="w-4 h-4 mr-2" />
                            <span>Add to Collection</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => handleAssignCollection(resource.id, undefined)}>
                                (Remove from Collection)
                              </DropdownMenuItem>
                              {collections.map(c => (
                                <DropdownMenuItem key={c.id} onClick={() => handleAssignCollection(resource.id, c.id)}>
                                  {c.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={() => handleDelete(resource.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardTitle className="font-heading text-heading-sm line-clamp-2 leading-tight">
                  {resource.title}
                </CardTitle>
                {resource.url && (
                  <CardDescription className="line-clamp-1 text-xs text-ash mt-1">
                    {resource.url}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <div className="bg-muted/50 p-3 rounded-md text-sm text-slate flex items-start gap-2 h-full">
                  <Bot className="w-4 h-4 mt-0.5 text-blueprint shrink-0" />
                  <p className="line-clamp-4 leading-relaxed">{resource.summary || "No summary available."}</p>
                </div>
              </CardContent>
              {resource.tags && resource.tags.length > 0 && (
                <CardFooter className="pt-2 flex-none">
                  <div className="flex flex-wrap gap-1.5">
                    {resource.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono text-slate bg-border/40 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <ResourceDetailSheet 
        resource={selectedResource} 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
      />
    </>
  );
}
