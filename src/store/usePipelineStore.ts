import { create } from 'zustand';

interface PipelineState {
  isProcessing: boolean;
  statusText: string;
  progress: number;
  setProcessing: (isProcessing: boolean, statusText?: string, progress?: number) => void;
  updateProgress: (statusText: string, progress: number) => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
  isProcessing: false,
  statusText: '',
  progress: 0,
  setProcessing: (isProcessing, statusText = '', progress = 0) => set({ isProcessing, statusText, progress }),
  updateProgress: (statusText, progress) => set({ statusText, progress }),
}));
