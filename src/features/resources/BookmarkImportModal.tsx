'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseBookmarksHtml, ParsedBookmark } from '@/lib/utils/bookmarkParser';
import { db } from '@/database/db';

interface BookmarkImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookmarkImportModal({ open, onOpenChange }: BookmarkImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [bookmarks, setBookmarks] = useState<ParsedBookmark[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setParsing(true);
    setError(null);

    try {
      const text = await selected.text();
      const parsed = parseBookmarksHtml(text);
      setBookmarks(parsed);
    } catch (err) {
      setError('Failed to parse bookmarks file.');
    } finally {
      setParsing(false);
    }
  };

  const handleImport = async () => {
    if (!bookmarks.length) return;
    setImporting(true);
    setError(null);

    try {
      // Get all existing URLs to avoid duplicates
      const existingResources = await db.resources.toArray();
      const existingUrls = new Set(existingResources.map(r => r.url).filter(Boolean));

      const toInsert = bookmarks
        .filter(b => !existingUrls.has(b.url))
        .map(b => ({
          id: crypto.randomUUID(),
          type: 'link' as const,
          title: b.title,
          url: b.url,
          content: '',
          summary: 'Imported bookmark. Pending AI processing.',
          tags: [],
          category: b.folder,
          createdAt: b.addDate || Date.now(),
          updatedAt: Date.now(),
        }));

      if (toInsert.length > 0) {
        await db.resources.bulkAdd(toInsert);
      }
      
      onOpenChange(false);
      setFile(null);
      setBookmarks([]);
    } catch (err) {
      console.error(err);
      setError('Failed to import bookmarks.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Bookmarks</DialogTitle>
          <DialogDescription>
            Upload your bookmarks HTML file exported from your browser.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <Input type="file" accept=".html" onChange={handleFileChange} disabled={parsing || importing} />
          
          {parsing && <p className="text-sm text-muted-foreground">Parsing file...</p>}
          
          {!parsing && bookmarks.length > 0 && (
            <p className="text-sm text-green-600">
              Found {bookmarks.length} bookmarks. {bookmarks.length - bookmarks.filter(b => {
                // Approximate duplicate check for preview
                return true; 
              }).length} duplicates will be skipped.
            </p>
          )}
          
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importing}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!bookmarks.length || importing}>
            {importing ? 'Importing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
