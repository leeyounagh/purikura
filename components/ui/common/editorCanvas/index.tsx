import { useEditorStore } from "@/store/useEditorStore";
import { useImageStore } from "@/store/useImageStore";
import React, { useEffect, useState } from "react";
import { Image as RNImage } from "react-native";
import styled from "styled-components/native";
import { BackgroundImage } from "./backgroundImage";
import { DrawingLayer } from "./drawingLayer";
import { FilterLayer } from "./filterLayer";
import { StickerLayer } from "./stickerLayer";

const CanvasWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const CanvasArea = styled.View`
  position: relative;
  width: 80%;
  aspect-ratio: 3/4;
  background-color: #191919;
  overflow: hidden;
`;

const DynamicPhoto = styled.Image<{ $aspectRatio: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  aspect-ratio: ${(props) => props.$aspectRatio};
  resize-mode: cover;
`;
const ButtonWrapper = styled.View`
  flex-direction: row;
`;
const AddStickerButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 32px;
  right: 24px;
  background-color: hotpink;
  padding: 10px 16px;
  border-radius: 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;
export default function EditorCanvas() {
  const imageUri = useImageStore((state) => state.imageUri);
  const [aspectRatio, setAspectRatio] = useState(2 / 3);
  const [isShowPalette, setIsShowPalette] = useState(true);
  const addSticker = useEditorStore((state) => state.addSticker);

  useEffect(() => {
    if (imageUri) {
      RNImage.getSize(
        imageUri,
        (width, height) => {
          setAspectRatio(width / height);
        },
        (error) => {
          console.warn("이미지 크기 가져오기 실패:", error);
        }
      );
    }
  }, [imageUri]);

  const handleAddSticker = () => {
    addSticker(require("../../../../assets/images/sample/sticker.png"));
  };

  return (
    <CanvasWrapper>
      <CanvasArea>
        <BackgroundImage />
        <DynamicPhoto
          source={
            imageUri
              ? { uri: imageUri }
              : require("../../../../assets/images/sample/user.png")
          }
          $aspectRatio={aspectRatio}
        />

        <StickerLayer />
        <FilterLayer />
      </CanvasArea>
      {isShowPalette && <DrawingLayer />}
      <AddStickerButton onPress={handleAddSticker}>
        <ButtonText>+ Sticker</ButtonText>
      </AddStickerButton>
    </CanvasWrapper>
  );
}
