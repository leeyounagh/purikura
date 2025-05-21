// useImageStore.ts
import { create } from 'zustand';

export const useImageStore = create(set => ({
  imageUri: null,
  setImageUri: (uri: string) => set({ imageUri: uri }),
}));
