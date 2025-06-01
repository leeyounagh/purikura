import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { PanResponder, PanResponderInstance, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import styled from "styled-components/native";

const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

export const DrawingLayer = forwardRef(function DrawingLayer(
  { currentColor, strokeWidth, disabled = false }: DrawingLayerProps,
  ref
) {
  const currentColorRef = useRef(currentColor);
  const strokeWidthRef = useRef(strokeWidth);
  const panResponderRef = useRef<PanResponderInstance | null>(null);

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

  useImperativeHandle(ref, () => ({
    undo: () => {
      pathsRef.current.pop();
      forceUpdate();
    },
    clear: () => {
      pathsRef.current = [];
      forceUpdate();
    },
  }));
  const panResponder = useMemo(() => {
    return PanResponder.create({
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
    });
  }, [disabled]);

  return (
    <Container>
      <View
        testID="drawing-container"
        style={{ flex: 1, pointerEvents: disabled ? "none" : "auto" }}
        {...panResponder.panHandlers}
      >
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
});
