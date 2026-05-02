// useImageStore.ts
import { create } from "zustand";

type ImageStore = {
  imageUri: string | null;
  /** 메인 화면 하단 배경 로고: 크롭이 1:1 일 때만 true */
  showMainBgLogo: boolean;
  setImageUri: (uri: string) => void;
  setShowMainBgLogo: (show: boolean) => void;
};

export const useImageStore = create<ImageStore>((set) => ({
  imageUri: null,
  showMainBgLogo: false,
  setImageUri: (uri: string) => set({ imageUri: uri }),
  setShowMainBgLogo: (show: boolean) => set({ showMainBgLogo: show }),
}));
