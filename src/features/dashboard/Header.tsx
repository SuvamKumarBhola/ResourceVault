"use client";

import { useResourceStore } from "@/store/useResourceStore";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UploadDialog } from "@/features/resources/UploadDialog";

export function Header() {
  const searchQuery = useResourceStore(state => state.searchQuery);
  const setSearchQuery = useResourceStore(state => state.setSearchQuery);

  return (
    <header className="h-[72px] bg-background flex items-center justify-between px-8 shrink-0">
      <div className="max-w-md w-full relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resources..." 
          className="pl-9 bg-card border-border h-10 w-full focus-visible:ring-ring rounded-radius-cards"
        />
      </div>
      <div className="flex items-center gap-4">
        <UploadDialog />
      </div>
    </header>
  );
}
