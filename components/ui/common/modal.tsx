import React, { useEffect } from "react";
import { Dimensions, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styled from "styled-components/native";

interface BottomSheetProps {
  visible: boolean;
  height?: number;
  onClose?: () => void;
  children: React.ReactNode;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

const Backdrop = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 998;
`;

const SheetContainer = styled(Animated.View)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1a1a1a;
  overflow: hidden;
  z-index: 999;
  padding-top: 5px;
  padding-bottom: 5px;
`;

export function BottomSheetModal({
  visible,
  height = 320,
  onClose,
  children,
}: BottomSheetProps) {
  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : height, { duration: 280 });
    backdropOpacity.value = withTiming(visible ? 1 : 0, { duration: 280 });
  }, [visible, height]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <>
      <Backdrop
        style={backdropStyle}
        pointerEvents={visible ? "auto" : "none"}
      >
        <Pressable onPress={onClose} style={{ flex: 1 }} />
      </Backdrop>
      <SheetContainer
        style={[{ height }, sheetStyle]}
        pointerEvents={visible ? "auto" : "none"}
      >
        {children}
      </SheetContainer>
    </>
  );
}
