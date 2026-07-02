"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/database/db";
import { useResourceStore } from "@/store/useResourceStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export function ResourceList() {
  const searchQuery = useResourceStore(state => state.searchQuery);
  const activeCollectionId = useResourceStore(state => state.activeCollectionId);

  const resources = useLiveQuery(async () => {
    // Naive filter for MVP
    const all = await db.resources.orderBy('createdAt').reverse().toArray();
    return all.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (r.url && r.url.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [searchQuery, activeCollectionId]) || [];

  if (resources.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate text-lg">No resources found. Add your first link to get started!</p>
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
          <Card className="h-full rounded-radius-cards shadow-md hover:shadow-lg transition-shadow border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="rounded-radius-badges bg-vellum text-ink capitalize">
                  {resource.type}
                </Badge>
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
                <CardDescription className="line-clamp-1 text-sm text-ash mt-1">
                  {resource.url}
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
