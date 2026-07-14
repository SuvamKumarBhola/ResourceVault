export interface ParsedBookmark {
  url: string;
  title: string;
  folder: string;
  addDate?: number;
}

export function parseBookmarksHtml(htmlStr: string): ParsedBookmark[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStr, 'text/html');
  const links = doc.querySelectorAll('a');
  const bookmarks: ParsedBookmark[] = [];

  links.forEach(link => {
    const url = link.getAttribute('href');
    if (!url || !url.startsWith('http')) return;

    const title = link.textContent || url;
    const addDateAttr = link.getAttribute('add_date');
    const addDate = addDateAttr ? parseInt(addDateAttr, 10) * 1000 : Date.now();

    // Traverse up to find the nearest folder name (usually in a <H3> preceding the <DL> container)
    let folder = 'Imported Bookmarks';
    let dlParent = link.closest('dl');
    if (dlParent) {
      const dtParent = dlParent.previousElementSibling;
      if (dtParent && dtParent.tagName.toLowerCase() === 'h3') {
        folder = dtParent.textContent || folder;
      }
    }

    bookmarks.push({ url, title, folder, addDate });
  });

  return bookmarks;
}
