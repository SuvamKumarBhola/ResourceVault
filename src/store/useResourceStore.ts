import { create } from 'zustand';

interface ResourceState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCollectionId: string | null;
  setActiveCollectionId: (id: string | null) => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  activeCollectionId: null,
  setActiveCollectionId: (id) => set({ activeCollectionId: id }),
}));
