import { create } from 'zustand';

export const useEditorStore = create((set) => ({
  isDrawing: false,
  setIsDrawing: (value: boolean) => set({ isDrawing: value }),
}));
