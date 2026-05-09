import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { PanResponder, PanResponderInstance, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";
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

const parsePathPoints = (commands: string[]) => {
  const points: { x: number; y: number }[] = [];
  for (const cmd of commands) {
    const match = cmd.match(/[ML]([\d.-]+),([\d.-]+)/);
    if (match) {
      points.push({ x: parseFloat(match[1]), y: parseFloat(match[2]) });
    }
  }
  return points;
};

function renderPathItem(item: PathItem, key: string) {
  const d = item.path.join(" ");
  const w = item.width;

  if (item.color === "glitter") {
    const points = parsePathPoints(item.path);
    return (
      <React.Fragment key={key}>
        <Path
          d={d}
          stroke="url(#glitterGrad)"
          strokeWidth={w}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points
          .filter((_, i) => i % 6 === 0)
          .map((p, i) => (
            <Circle
              key={`${key}-spark-${i}`}
              cx={p.x}
              cy={p.y}
              r={(i % 3) + 2}
              fill="white"
              opacity={0.9}
            />
          ))}
      </React.Fragment>
    );
  }

  if (item.color === "neon") {
    const neonColor = "#00FFFF";
    return (
      <React.Fragment key={key}>
        <Path
          d={d}
          stroke={neonColor}
          strokeWidth={w * 3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.25}
        />
        <Path
          d={d}
          stroke={neonColor}
          strokeWidth={w * 1.8}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.5}
        />
        <Path
          d={d}
          stroke="white"
          strokeWidth={Math.max(w * 0.6, 1)}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </React.Fragment>
    );
  }

  if (item.color === "rainbow") {
    return (
      <Path
        key={key}
        d={d}
        stroke="url(#rainbowGrad)"
        strokeWidth={w}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }

  return (
    <Path
      key={key}
      d={d}
      stroke={item.color}
      strokeWidth={w}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export const DrawingLayer = forwardRef(function DrawingLayer(
  { currentColor, strokeWidth, disabled = false }: DrawingLayerProps,
  ref
) {
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
    <Container pointerEvents={disabled ? "none" : "auto"}>
      <View
        testID="drawing-container"
        style={{ flex: 1 }}
        {...panResponder.panHandlers}
      >
        <Svg style={{ flex: 1 }} pointerEvents={disabled ? "none" : "auto"}>
          <Defs>
            <LinearGradient
              id="glitterGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FF1493" />
              <Stop offset="25%" stopColor="#FFD700" />
              <Stop offset="50%" stopColor="#00FFFF" />
              <Stop offset="75%" stopColor="#9370DB" />
              <Stop offset="100%" stopColor="#FF00FF" />
            </LinearGradient>
            <LinearGradient
              id="rainbowGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FF0000" />
              <Stop offset="16%" stopColor="#FF7F00" />
              <Stop offset="33%" stopColor="#FFFF00" />
              <Stop offset="50%" stopColor="#00FF00" />
              <Stop offset="66%" stopColor="#0000FF" />
              <Stop offset="83%" stopColor="#4B0082" />
              <Stop offset="100%" stopColor="#9400D3" />
            </LinearGradient>
          </Defs>
          {pathsRef.current.map((item, idx) =>
            renderPathItem(item, `committed-${idx}`)
          )}
          {currentPath.current.path.length > 0 &&
            renderPathItem(currentPath.current, "current")}
        </Svg>
      </View>
    </Container>
  );
});
