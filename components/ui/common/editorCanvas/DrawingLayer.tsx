import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useEffect, useRef, useState } from "react";
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
  z-index:50;
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

export function DrawingLayer() {
  const [currentColor, setCurrentColor] = useState("hotpink");
  const currentColorRef = useRef(currentColor);

  useEffect(() => {
    currentColorRef.current = currentColor;
  }, [currentColor]);

  const [strokeWidth, setStrokeWidth] = useState(3);
  const strokeWidthRef = useRef(strokeWidth);

  useEffect(() => {
    strokeWidthRef.current = strokeWidth;
  }, [strokeWidth]);

  const [visible, setVisible] = useState(true);
  const pathsRef = useRef<{ color: string; path: string[]; width: number }[]>([]);
  const currentPath = useRef<{ color: string; path: string[]; width: number }>({
    color: "hotpink",
    path: [],
    width: 3,
  });
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        currentPath.current.path = [`M${locationX},${locationY}`];
        currentPath.current.color = currentColorRef.current;
        currentPath.current.width = strokeWidthRef.current;
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        currentPath.current.path.push(`L${locationX},${locationY}`);
        forceUpdate();
      },
      onPanResponderRelease: () => {
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

  const handleUndo = () => {
    pathsRef.current.pop();
    forceUpdate();
  };

  const handleClear = () => {
    pathsRef.current = [];
    forceUpdate();
  };

  if (!visible) return null;

  return (
    <Container>
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
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
          {Array.isArray(currentPath.current.path) && currentPath.current.path.length > 0 && (
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

      <BottomBar>
        <Palette>
          {COLORS.map((color) => (
            <ColorButton
              key={color}
              bg={color}
              selected={currentColor === color}
              onPress={() => setCurrentColor(color)}
            />
          ))}
        </Palette>

        <ControlRow>
          <ControlIcon onPress={handleUndo}>
            <MaterialIcons name="undo" size={20} color="black" />
          </ControlIcon>

          <ControlIcon onPress={handleClear}>
            <MaterialIcons name="delete" size={20} color="black" />
          </ControlIcon>

          <StrokeSlider
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={strokeWidth}
            onValueChange={setStrokeWidth}
          />

          <CloseButton onPress={() => setVisible(false)}>
            <MaterialIcons name="close" size={20} color="black" />
          </CloseButton>
        </ControlRow>
      </BottomBar>
    </Container>
  );
}