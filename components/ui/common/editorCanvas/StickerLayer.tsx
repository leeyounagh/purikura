import { useEditorStore } from "@/store/useEditorStore";
import React, { useEffect } from "react";
import { Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StickerItem } from "./StickerItem";

export const StickerLayer = ({
  sheetType,
  pentoolVisible,
  selectedId,
  handleDeselect,
  setSelectedId,
}: {
  sheetType: string;
  pentoolVisible: boolean;
  selectedId: string | null;
  handleDeselect: () => void;
  setSelectedId:(id: string) => void;
}) => {
  const stickers = useEditorStore((s) => s.stickers);
  useEffect(() => {
    if (sheetType !== "sticker" || pentoolVisible) {
      handleDeselect();
    }
  }, [sheetType, pentoolVisible]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={handleDeselect}>
        {stickers.map((sticker) => (
          <StickerItem
            key={sticker.id}
            id={sticker.id}
            source={sticker.source}
            x={sticker.x}
            y={sticker.y}
            scale={sticker.scale}
            isSelected={selectedId === sticker.id}
            onSelect={setSelectedId}
          />
        ))}
      </Pressable>
    </GestureHandlerRootView>
  );
};
