// DrawingToolbar.tsx
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React from "react";
import styled from "styled-components/native";

const COLORS = ["hotpink", "red", "blue", "black", "orange"];

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

type Props = {
  currentColor: string;
  strokeWidth: number;
  onChangeColor: (color: string) => void;
  onChangeWidth: (width: number) => void;
  onUndo: () => void;
  onClear: () => void;
  onClose: () => void;
};

export const DrawingToolbar = ({
  currentColor,
  strokeWidth,
  onChangeColor,
  onChangeWidth,
  onUndo,
  onClear,
  onClose,
}: Props) => {
  

  return (
    <BottomBar>
      <Palette>
        {COLORS.map((color) => (
          <ColorButton
            key={color}
            bg={color}
            selected={currentColor === color}
            onPress={() => onChangeColor(color)}
          />
        ))}
      </Palette>

      <ControlRow>
        <ControlIcon onPress={onUndo}>
          <MaterialIcons name="undo" size={20} color="black" />
        </ControlIcon>

        <ControlIcon onPress={onClear}>
          <MaterialIcons name="delete" size={20} color="black" />
        </ControlIcon>

        <StrokeSlider
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={strokeWidth}
          onValueChange={onChangeWidth}
        />

        <CloseButton onPress={onClose}>
          <MaterialIcons name="close" size={20} color="black" />
        </CloseButton>
      </ControlRow>
    </BottomBar>
  );
};
