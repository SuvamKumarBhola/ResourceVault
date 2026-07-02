"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/database/db";
import { useResourceStore } from "@/store/useResourceStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Bot } from "lucide-react";
import { motion } from "framer-motion";

export function ResourceList() {
  const searchQuery = useResourceStore(state => state.searchQuery);
  const activeCollectionId = useResourceStore(state => state.activeCollectionId);

  const resources = useLiveQuery(async () => {
    const all = await db.resources.orderBy('createdAt').reverse().toArray();
    return all.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (r.url && r.url.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (r.summary && r.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (r.tags && r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesSearch;
    });
  }, [searchQuery, activeCollectionId]) || [];

  if (resources.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate text-lg">No resources found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="h-full flex flex-col rounded-radius-cards shadow-md hover:shadow-lg transition-shadow border-border bg-card">
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
                {resource.type === 'link' && resource.url && (
                  <a href={resource.url} target="_blank" rel="noreferrer" className="text-blueprint hover:underline">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
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
  );
}
