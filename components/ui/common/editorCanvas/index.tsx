import { useEditorStore } from "@/store/useEditorStore";
import { useImageStore } from "@/store/useImageStore";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image as RNImage,
  type LayoutChangeEvent,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import styled from "styled-components/native";
import { BackgroundImage } from "./BackgroundImage";
import { DrawingLayer } from "./DrawingLayer";
import { DrawingToolbar } from "./drawingToolbar";
import { FilterLayer } from "./filterLayer";
import { StickerLayer } from "./StickerLayer";

const CanvasWrapper = styled.View`
  flex: 1;
  margin-top: 10px;
  align-items: center;
`;
const InnerArea = styled.View`
  flex: 1;
  width: 100%;
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
  pointer-events: none;
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
  sheetType,
}: {
  pentoolVisible: boolean;
  onPentoolClose: () => void;
  isSave: boolean;
  onSaveComplete: () => void;
  sheetType: string;
}) {
  const imageUri = useImageStore((state) => state.imageUri);
  const resetVersion = useEditorStore((state) => state.resetVersion);
  const viewShotRef = useRef(null);
  const drawingLayerRef = useRef<{ undo: () => void; clear: () => void }>(null);
  const [aspectRatio, setAspectRatio] = useState(2 / 3);
  const [currentColor, setCurrentColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(
    null
  );
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [innerLayout, setInnerLayout] = useState({ width: 0, height: 0 });

  const onInnerLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width < 1 || height < 1) return;
    setInnerLayout((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height }
    );
  };

  const viewShotSize = useMemo(() => {
    const ar = aspectRatio > 0 ? aspectRatio : 2 / 3;
    let w = innerLayout.width;
    let h = innerLayout.height;
    if (w < 1 || h < 1) {
      const dim = Dimensions.get("window");
      w = dim.width - 40;
      h = dim.height * 0.48;
    }
    const pad = 12;
    const maxW = w - pad * 2;
    const maxH = h - pad * 2;
    let vw = maxW;
    let vh = vw / ar;
    if (vh > maxH) {
      vh = maxH;
      vw = vh * ar;
    }
    return { width: vw, height: vh };
  }, [innerLayout, aspectRatio]);

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
    if (resetVersion > 0) {
      drawingLayerRef.current?.clear();
    }
  }, [resetVersion]);

  useEffect(() => {
    if (isSave) {
      handleDeselect(); // selectedStickerId를 null로 만든다
    }
  }, [isSave]);

  useEffect(() => {
    if (isSave && selectedStickerId === null) {
      handleSaveImage();
    }
  }, [selectedStickerId, isSave]);

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
      resetEditor()
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
    useEditorStore.getState().setFilter(null);
    useEditorStore.getState().setBackgroundUri("");
    drawingLayerRef.current?.clear();
    forceUpdate();
  };
  const handleDeselect = () => {
    setSelectedStickerId(null);
  };
  return (
    <CanvasWrapper>
      <InnerArea onLayout={onInnerLayout}>
        <ViewShot
          ref={viewShotRef}
          style={{
            width: viewShotSize.width,
            height: viewShotSize.height,
            backgroundColor: "#191919",
          }}
          options={{ result: "tmpfile", quality: 1 }}
        >
          <CanvasArea>
            <BackgroundImage />
            {imageUri && <DynamicPhoto source={{ uri: imageUri }} />}
            <FilterLayer />
            {pentoolVisible ? (
              <>
                <StickerLayer
                  sheetType={sheetType}
                  pentoolVisible={pentoolVisible}
                  selectedId={selectedStickerId}
                  handleDeselect={handleDeselect}
                  setSelectedId={setSelectedStickerId}
                />
                <DrawingLayer
                  ref={drawingLayerRef}
                  currentColor={currentColor}
                  strokeWidth={strokeWidth}
                  disabled={false}
                />
              </>
            ) : (
              <>
                <DrawingLayer
                  ref={drawingLayerRef}
                  currentColor={currentColor}
                  strokeWidth={strokeWidth}
                  disabled
                />
                <StickerLayer
                  sheetType={sheetType}
                  pentoolVisible={pentoolVisible}
                  selectedId={selectedStickerId}
                  handleDeselect={handleDeselect}
                  setSelectedId={setSelectedStickerId}
                />
              </>
            )}
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
