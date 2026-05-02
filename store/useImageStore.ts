// useImageStore.ts
import { create } from "zustand";

type ImageStore = {
  imageUri: string | null;
  setImageUri: (uri: string) => void;
};

export const useImageStore = create<ImageStore>((set) => ({
  imageUri: null,
  setImageUri: (uri: string) => set({ imageUri: uri }),
}));
