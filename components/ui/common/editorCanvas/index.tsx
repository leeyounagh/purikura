import { useEditorStore } from "@/store/useEditorStore";
import { useImageStore } from "@/store/useImageStore";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image as RNImage } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import styled from "styled-components/native";
import { BackgroundImage } from "./backgroundImage";
import { DrawingLayer } from "./drawingLayer";
import { DrawingToolbar } from "./drawingToolbar";
import { FilterLayer } from "./filterLayer";
import { StickerLayer } from "./stickerLayer";

const CanvasWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const CanvasArea = styled.View`
  width: 100%;
  height: 100%;
  background-color: #191919;
  overflow: hidden;
`;

const DynamicPhoto = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const AddStickerButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 32px;
  right: 24px;
  background-color: hotpink;
  padding: 10px 16px;
  border-radius: 20px;
`;

const SaveImageButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 90px;
  right: 24px;
  background-color: deepskyblue;
  padding: 10px 16px;
  border-radius: 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

export default function EditorCanvas() {
  const imageUri = useImageStore((state) => state.imageUri);
  const addSticker = useEditorStore((state) => state.addSticker);
  const viewShotRef = useRef(null);

  const [aspectRatio, setAspectRatio] = useState(2 / 3);
  const [currentColor, setCurrentColor] = useState("hotpink");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [visible, setVisible] = useState(true);
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const pathsRef = useRef<{ color: string; path: string[]; width: number }[]>(
    []
  );

  useEffect(() => {
    if (imageUri) {
      RNImage.getSize(
        imageUri,
        (width, height) => setAspectRatio(width / height),
        (error) => console.warn("이미지 크기 가져오기 실패:", error)
      );
    }
  }, [imageUri]);

  const handleAddSticker = () => {
    addSticker(require("../../../../assets/images/sample/sticker.png"));
  };

  const handleSaveImage = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 1,
      });

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 거부", "갤러리에 접근 권한이 필요합니다.");
        return;
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("저장 완료", "사진이 갤러리에 저장되었습니다.");
    } catch (e) {
      console.error("저장 실패:", e);
      Alert.alert("저장 실패", "사진을 저장할 수 없습니다.");
    }
  };

  const handleUndo = () => {
    pathsRef.current.pop();
    forceUpdate();
  };

  const handleClear = () => {
    pathsRef.current = [];
    forceUpdate();
  };

  return (
    <CanvasWrapper>
      <ViewShot
        ref={viewShotRef}
        style={{ width: "80%", aspectRatio, backgroundColor: "#191919" }}
        options={{ result: "tmpfile", quality: 1 }}
      >
        <CanvasArea>
          <BackgroundImage />
          <DynamicPhoto
            source={
              imageUri
                ? { uri: imageUri }
                : require("../../../../assets/images/sample/user2.jpg")
            }
          />

          <StickerLayer />
          <DrawingLayer
            currentColor={currentColor}
            strokeWidth={strokeWidth}
            disabled={!visible}
          />
          <FilterLayer />
        </CanvasArea>
      </ViewShot>
      {visible && (
        <DrawingToolbar
          currentColor={currentColor}
          strokeWidth={strokeWidth}
          onChangeColor={setCurrentColor}
          onChangeWidth={setStrokeWidth}
          onClose={() => setVisible(false)}
          onUndo={handleUndo}
          onClear={handleClear}
        />
      )}
      <AddStickerButton onPress={handleAddSticker}>
        <ButtonText>+ Sticker</ButtonText>
      </AddStickerButton>

      <SaveImageButton onPress={handleSaveImage}>
        <ButtonText>저장하기</ButtonText>
      </SaveImageButton>
    </CanvasWrapper>
  );
}
