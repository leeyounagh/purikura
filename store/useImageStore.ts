// useImageStore.ts
import { create } from 'zustand';

export const useImageStore = create(set => ({
  imageUri: null,
  imageSize: { width: 0, height: 0 },
  setImageUri: (uri: string) => set({ imageUri: uri }),
  setImageSize: (width: number, height: number) => set({ imageSize: { width, height } }),
}));
