import { useEditorStore } from "@/store/useEditorStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { PanResponder, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import styled from "styled-components/native";

const StickerImage = styled(Animated.Image)<{ isSelected: boolean }>`
  width: 60px;
  height: 60px;
  border-width: ${(props) => (props.isSelected ? "2px" : "0px")};
  border-color: hotpink;
  border-radius: 8px;
`;

const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: red;
  border-radius: 10px;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const DeleteText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  width: 100%;
`;

const ControlIcon = styled(Animated.View)`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  elevation: 4;
`;

type Props = {
  id: string;
  source: any;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export function StickerItem({
  id,
  source,
  x,
  y,
  scale,
  rotation,
  isSelected,
  onSelect,
}: Props) {
  const updatePosition = useEditorStore((s) => s.updateStickerPosition);
  const updateScale = useEditorStore((s) => s.updateStickerScale);
  const updateRotation = useEditorStore((s) => s.updateStickerRotation);
  const removeSticker = useEditorStore((s) => s.removeSticker);

  const offsetX = useSharedValue(x);
  const offsetY = useSharedValue(y);
  const scaleVal = useSharedValue(scale);
  const rotationVal = useSharedValue(rotation);

  let startScale = scale;
  let startRotation = 0;
  let rotateStartVal = 0;
  let resizeStartVal = scale;

  const stickerViewRef = useRef<View>(null);
  const rotateState = useRef({
    centerX: 0,
    centerY: 0,
    startAngle: 0,
    ready: false,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: scaleVal.value },
      { rotateZ: `${rotationVal.value}rad` },
    ],
  }));

  const controlIconCounterStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: `${-rotationVal.value}rad` },
      { scale: 1 / scaleVal.value },
    ],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      offsetX.value = x + e.translationX;
      offsetY.value = y + e.translationY;
    })
    .onEnd((e) => {
      const newX = x + e.translationX;
      const newY = y + e.translationY;
      runOnJS(updatePosition)(id, newX, newY);
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      startScale = scaleVal.value;
    })
    .onUpdate((e) => {
      scaleVal.value = startScale * e.scale;
    })
    .onEnd(() => {
      runOnJS(updateScale)(id, scaleVal.value);
    });

  const rotationGesture = Gesture.Rotation()
    .onStart(() => {
      startRotation = rotationVal.value;
    })
    .onUpdate((e) => {
      rotationVal.value = startRotation + e.rotation;
    })
    .onEnd(() => {
      runOnJS(updateRotation)(id, rotationVal.value);
    });

  const combinedGesture = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    rotationGesture
  );

  const handleRotateDrag = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      rotateStartVal = rotationVal.value;
      rotateState.current.ready = false;
      stickerViewRef.current?.measureInWindow((x, y, width, height) => {
        const cx = x + width / 2;
        const cy = y + height / 2;
        rotateState.current = {
          centerX: cx,
          centerY: cy,
          startAngle: Math.atan2(
            e.nativeEvent.pageY - cy,
            e.nativeEvent.pageX - cx
          ),
          ready: true,
        };
      });
    },
    onPanResponderMove: (e) => {
      if (!rotateState.current.ready) return;
      const { centerX, centerY, startAngle } = rotateState.current;
      const currentAngle = Math.atan2(
        e.nativeEvent.pageY - centerY,
        e.nativeEvent.pageX - centerX
      );
      rotationVal.value = rotateStartVal + (currentAngle - startAngle);
    },
    onPanResponderRelease: () => {
      runOnJS(updateRotation)(id, rotationVal.value);
    },
  });

  const handleResizeDrag = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      resizeStartVal = scaleVal.value;
    },
    onPanResponderMove: (_, gestureState) => {
      const newScale = resizeStartVal + gestureState.dx * 0.003;
      scaleVal.value = Math.max(0.3, Math.min(3, newScale));
    },
    onPanResponderRelease: () => {
      runOnJS(updateScale)(id, scaleVal.value);
    },
  });

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View
        ref={stickerViewRef}
        style={[{ position: "absolute" }, animatedStyle]}
      >
        <View style={{ alignItems: "center" }} testID={`sticker-${id}`}>
          <Pressable onPress={() => onSelect(id)}>
            <StickerImage
              source={source}
              isSelected={isSelected}
              resizeMode="contain"
              testID="sticker-image"
            />
          </Pressable>

          {isSelected && (
            <>
              <DeleteButton
                onPress={() => removeSticker(id)}
                testID="delete-button"
              >
                <DeleteText>X</DeleteText>
              </DeleteButton>

              <ControlIcon
                style={[{ bottom: -10, right: -10 }, controlIconCounterStyle]}
                {...handleRotateDrag.panHandlers}
                testID="rotate-icon"
              >
                <MaterialCommunityIcons
                  name="rotate-right"
                  size={18}
                  color="black"
                />
              </ControlIcon>

              <ControlIcon
                style={[{ bottom: -10, left: -10 }, controlIconCounterStyle]}
                {...handleResizeDrag.panHandlers}
                testID="resize-icon"
              >
                <MaterialCommunityIcons name="resize" size={18} color="black" />
              </ControlIcon>
            </>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
