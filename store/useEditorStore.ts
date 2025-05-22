// store/useEditorStore.ts
import { ImageSourcePropType } from "react-native";
import { create } from "zustand";

export type Sticker = {
  id: string;
  source: ImageSourcePropType;
  x: number;
  y: number;
  scale: number;
};

interface EditorState {
  imageUri: string | null;
  backgroundUri: string | null;
  stickers: Sticker[];
  filter: string | null;

  setImageUri: (uri: string) => void;
  setBackgroundUri: (uri: string) => void;
  addSticker: (source: ImageSourcePropType) => void;
  updateStickerPosition: (id: string, x: number, y: number) => void;
  updateStickerScale: (id: string, scale: number) => void;
  removeSticker: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  imageUri: null,
  backgroundUri: null,
  stickers: [],
  filter: null,

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
        },
      ],
    })),
  updateStickerPosition: (id, x, y) =>
    set((state) => ({
      stickers: state.stickers.map((s) =>
        s.id === id ? { ...s, x, y } : s
      ),
    })),
  updateStickerScale: (id, scale) =>
    set((state) => ({
      stickers: state.stickers.map((s) =>
        s.id === id ? { ...s, scale } : s
      ),
    })),
  removeSticker: (id) =>
    set((state) => ({
      stickers: state.stickers.filter((s) => s.id !== id),
    })),
}));
