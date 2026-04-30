// store/useEditorStore.ts
import { ImageSourcePropType } from "react-native";
import { create } from "zustand";
import type { FilterItem } from "@/components/ui/main/utils/images";

export type Sticker = {
  id: string;
  source: ImageSourcePropType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

interface EditorState {
  imageUri: string | null;
  backgroundUri: string | null;
  stickers: Sticker[];
  filter: FilterItem | null;
  resetVersion: number;

  setImageUri: (uri: string) => void;
  setBackgroundUri: (uri: string) => void;
  addSticker: (source: ImageSourcePropType) => void;
  updateStickerPosition: (id: string, x: number, y: number) => void;
  updateStickerScale: (id: string, scale: number) => void;
  updateStickerRotation: (id: string, rotation: number) => void;
  removeSticker: (id: string) => void;
  setFilter: (filter: FilterItem | null) => void;
  clearStickers: () => void;
  resetEditor: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  imageUri: null,
  backgroundUri: null,
  stickers: [],
  filter: null,
  resetVersion: 0,

  setImageUri: (uri) => set({ imageUri: uri }),
  setBackgroundUri: (uri) => set({ backgroundUri: uri }),
  addSticker: (source) =>
    set((state) => ({
      stickers: [
        ...state.stickers,
        {
          id: Date.now().toString(),
          source,
          x: 100,
          y: 100,
          scale: 1,
          rotation: 0,
        },
      ],
    })),
  clearStickers: () => set({ stickers: [] }),
  updateStickerPosition: (id, x, y) =>
    set((state) => ({
      stickers: state.stickers.map((s) => (s.id === id ? { ...s, x, y } : s)),
    })),
  updateStickerScale: (id, scale) =>
    set((state) => ({
      stickers: state.stickers.map((s) => (s.id === id ? { ...s, scale } : s)),
    })),
  updateStickerRotation: (id, rotation) =>
    set((state) => ({
      stickers: state.stickers.map((s) =>
        s.id === id ? { ...s, rotation } : s
      ),
    })),
  removeSticker: (id) =>
    set((state) => ({
      stickers: state.stickers.filter((s) => s.id !== id),
    })),
  setFilter: (filter) => set({ filter }),
  resetEditor: () =>
    set((state) => ({
      stickers: [],
      filter: null,
      backgroundUri: null,
      resetVersion: state.resetVersion + 1,
    })),
}));
