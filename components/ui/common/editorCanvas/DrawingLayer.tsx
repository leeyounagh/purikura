import Slider from "@react-native-community/slider";
import React, { useEffect, useRef } from "react";
import { PanResponder, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import styled from "styled-components/native";

const COLORS = ["hotpink", "red", "blue", "black", "orange"];

const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const BottomBar = styled.View`
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  align-items: center;
  z-index: 50;
`;

const Palette = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 12px;
`;

const ControlRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const ColorButton = styled.TouchableOpacity<{ selected: boolean; bg: string }>`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${(props) => props.bg};
  border-width: ${(props) => (props.selected ? 2 : 0)}px;
  border-color: white;
`;

const ControlIcon = styled.TouchableOpacity`
  background-color: white;
  border-radius: 18px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  elevation: 2;
`;

const StrokeSlider = styled(Slider)`
  width: 120px;
`;

const CloseButton = styled.TouchableOpacity`
  background-color: white;
  border-radius: 18px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  elevation: 2;
`;

type PathItem = {
  color: string;
  path: string[];
  width: number;
};

type DrawingLayerProps = {
  currentColor: string;
  strokeWidth: number;
  disabled?: boolean;
};

export function DrawingLayer({
  currentColor,
  strokeWidth,
  disabled=false,
}: DrawingLayerProps) {
  const currentColorRef = useRef(currentColor);
  const strokeWidthRef = useRef(strokeWidth);

  useEffect(() => {
    currentColorRef.current = currentColor;
  }, [currentColor]);

  useEffect(() => {
    strokeWidthRef.current = strokeWidth;
  }, [strokeWidth]);

  const pathsRef = useRef<PathItem[]>([]);
  const currentPath = useRef<PathItem>({
    color: currentColor,
    path: [],
    width: strokeWidth,
  });
  

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const panResponder = useRef(
   PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (e) => {
        if (disabled) return;
        const { locationX, locationY } = e.nativeEvent;
        currentPath.current.path = [`M${locationX},${locationY}`];
        currentPath.current.color = currentColorRef.current;
        currentPath.current.width = strokeWidthRef.current;
      },
      onPanResponderMove: (e) => {
        if (disabled) return;
        const { locationX, locationY } = e.nativeEvent;
        currentPath.current.path.push(`L${locationX},${locationY}`);
        forceUpdate();
      },
      onPanResponderRelease: () => {
        if (disabled) return;
        if (currentPath.current.path.length > 0) {
          pathsRef.current.push({ ...currentPath.current });
        }
        currentPath.current = {
          color: currentColorRef.current,
          path: [],
          width: strokeWidthRef.current,
        };
        forceUpdate();
      },
    })
  ).current;
  

  return (
    <Container>
      <View style={{ flex: 1, pointerEvents: disabled ? "none" : "auto" }} {...panResponder.panHandlers}>
        <Svg style={{ flex: 1 }}>
          {pathsRef.current.map((item, idx) => (
            <Path
              key={`path-${idx}`}
              d={item.path.join(" ")}
              stroke={item.color}
              strokeWidth={item.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentPath.current.path.length > 0 && (
            <Path
              d={currentPath.current.path.join(" ")}
              stroke={currentPath.current.color}
              strokeWidth={currentPath.current.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>
    </Container>
  );
}
