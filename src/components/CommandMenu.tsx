"use client";

import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";
import { FileText, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { ResourceDetailSheet } from "@/features/resources/ResourceDetailSheet";
import { Resource } from "@/types";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const resources = useLiveQuery(() => db.resources.toArray()) || [];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (resource: Resource) => {
    setOpen(false);
    setSelectedResource(resource);
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all your knowledge..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Resources">
            {resources.map((resource) => (
              <CommandItem key={resource.id} onSelect={() => handleSelect(resource)}>
                {resource.type === 'link' ? <LinkIcon className="mr-2 h-4 w-4" /> : 
                 resource.type === 'image' ? <ImageIcon className="mr-2 h-4 w-4" /> : 
                 <FileText className="mr-2 h-4 w-4" />}
                <span className="truncate">{resource.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <ResourceDetailSheet 
        resource={selectedResource} 
        open={selectedResource !== null} 
        onOpenChange={(val) => !val && setSelectedResource(null)} 
      />
    </>
  );
}
