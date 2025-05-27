import { useEditorStore } from "@/store/useEditorStore";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StickerItem } from "./StickerItem";

export const StickerLayer = ({
  pentoolVisible,
}: {
  pentoolVisible: boolean;
}) => {
  const stickers = useEditorStore((s) => s.stickers);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const handleDeselect = () => {
    setSelectedId(null);
  };
  useEffect(() => {
    if (pentoolVisible && selectedId !== null) {
      setSelectedId(null);
    }
  }, [pentoolVisible]);
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
