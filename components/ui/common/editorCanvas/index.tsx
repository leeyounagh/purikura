import { useEditorStore } from "@/store/useEditorStore";
import { useImageStore } from "@/store/useImageStore";
import { MaterialIcons } from "@expo/vector-icons";
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
  margin-top: 100px;
  align-items: center;
`;
const InnerArea = styled.View`
  align-items: center;
  justify-content: flex-end;
  height: 460px;
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
const ButtonWrapper = styled.View`
  width: 100%;
  align-items: flex-end;
  padding-right: 20px;
  margin-top: 12px;
`;
const ResetButton = styled.TouchableOpacity`
  background-color: black;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 20px;
  elevation: 2;
`;

export default function EditorCanvas({
  pentoolVisible,
  onPentoolClose,
  isSave = false,
  onSaveComplete,
}: {
  pentoolVisible: boolean;
  onPentoolClose: () => void;
  isSave: boolean;
  onSaveComplete: () => void;
}) {
  const imageUri = useImageStore((state) => state.imageUri);
  const viewShotRef = useRef(null);
  const drawingLayerRef = useRef<{ undo: () => void; clear: () => void }>(null);
  const [aspectRatio, setAspectRatio] = useState(2 / 3);
  const [currentColor, setCurrentColor] = useState("");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (imageUri) {
      RNImage.getSize(
        imageUri,
        (width, height) => setAspectRatio(width / height),
        (error) => console.warn("이미지 크기 가져오기 실패:", error)
      );
    }
  }, [imageUri]);

  useEffect(() => {
    if (isSave) {
      handleSaveImage();
    }
  }, [isSave]);

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
    } finally {
      onSaveComplete();
    }
  };

  const handleUndo = () => {
    drawingLayerRef.current?.undo();
    forceUpdate();
  };

  const handleClear = () => {
    drawingLayerRef.current?.clear();
    forceUpdate();
  };
  const resetEditor = () => {
    useEditorStore.getState().clearStickers();
    useEditorStore.getState().setFilter("");
    useEditorStore.getState().setBackgroundUri("");
    drawingLayerRef.current?.clear();
    forceUpdate();
  };

  return (
    <CanvasWrapper>
      <InnerArea>
        <ViewShot
          ref={viewShotRef}
          style={{ width: "80%", aspectRatio, backgroundColor: "#191919" }}
          options={{ result: "tmpfile", quality: 1 }}
        >
          <CanvasArea>
            <BackgroundImage />
            {imageUri && <DynamicPhoto source={{ uri: imageUri }} />}
            <FilterLayer />
            <StickerLayer />
            <DrawingLayer
              ref={drawingLayerRef}
              currentColor={currentColor}
              strokeWidth={strokeWidth}
              disabled={!pentoolVisible}
            />
          </CanvasArea>
        </ViewShot>
      </InnerArea>
      <ButtonWrapper>
        <ResetButton onPress={resetEditor}>
          <MaterialIcons name="restart-alt" size={24} color="white" />
        </ResetButton>
      </ButtonWrapper>

      {pentoolVisible && (
        <DrawingToolbar
          currentColor={currentColor}
          strokeWidth={strokeWidth}
          onChangeColor={setCurrentColor}
          onChangeWidth={setStrokeWidth}
          onClose={onPentoolClose}
          onUndo={handleUndo}
          onClear={handleClear}
        />
      )}
    </CanvasWrapper>
  );
}
