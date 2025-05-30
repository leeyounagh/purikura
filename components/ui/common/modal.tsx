import React from "react";
import { Animated, Dimensions } from "react-native";
import styled from "styled-components/native";

interface BottomSheetProps {
  visible: boolean;
  height?: number;
  children: React.ReactNode;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

const SheetContainer = styled(Animated.View)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color:#1a1a1a;
  overflow: hidden;
  z-index: 999;
  padding-top: 5px;
  pdding-bottom: 5px;
`;

export function BottomSheetModal({
  visible,
  height = SCREEN_HEIGHT * 0.1,
  children,
}: BottomSheetProps) {
  return (
    visible && <SheetContainer style={{ height }}>{children}</SheetContainer>
  );
}
