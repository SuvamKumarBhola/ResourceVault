'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkImportModal } from '@/features/resources/BookmarkImportModal';
import { Upload } from 'lucide-react';

export function ImportBookmarksButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <Upload size={16} />
        Import Bookmarks
      </Button>
      <BookmarkImportModal open={open} onOpenChange={setOpen} />
    </>
  );
}
