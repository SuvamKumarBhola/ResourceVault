export interface Resource {
  id: string;
  type: 'link' | 'pdf' | 'image' | 'screenshot' | 'markdown' | 'text';
  title: string;
  url?: string;
  content?: string;
  summary?: string;
  fileData?: ArrayBuffer | null;
  mimeType?: string;
  tags: string[];
  category?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Collection {
  id: string;
  name: string;
  isCustom: boolean;
  createdAt: number;
}
