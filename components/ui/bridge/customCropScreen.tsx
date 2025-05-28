import { useImageStore } from "@/store/useImageStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ViewShot from "react-native-view-shot";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function CustomCropScreen() {
  const imageUri = useImageStore((state) => state.imageUri);
  const setImageUri = useImageStore((state) => state.setImageUri);
  const router = useRouter();

  const viewShotRef = useRef<ViewShot>(null);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const [aspectRatio, setAspectRatio] = useState({ width: 3, height: 4 });

  const baseScale = useSharedValue(1);
  const pinchScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      pinchScale.value = e.scale;
    })
    .onEnd(() => {
      baseScale.value *= pinchScale.value;
      pinchScale.value = 1;
    });

  const panGesture = Gesture.Pan().onUpdate((e) => {
    translateX.value = e.translationX;
    translateY.value = e.translationY;
  });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: baseScale.value * pinchScale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const CROP_WIDTH = SCREEN_WIDTH;
  const CROP_HEIGHT = SCREEN_WIDTH * (aspectRatio.height / aspectRatio.width);

  const onCapture = async () => {
    if (viewShotRef.current) {
      const uri = await viewShotRef.current.capture();
      setImageUri(uri);
      router.push("/main");
    }
  };

  const resetTransform = () => {
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    rotation.value = withTiming(0);
  };

  const rotateImage = () => {
    rotation.value = withTiming((rotation.value + 90) % 360);
  };

  const toggleAspectRatio = () => {
    setAspectRatio((prev) =>
      prev.width === 3 && prev.height === 4
        ? { width: 1, height: 1 }
        : { width: 3, height: 4 }
    );
  };

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}
    >
      <View
        style={{
          width: CROP_WIDTH,
          height: CROP_HEIGHT,
          overflow: "hidden",
          borderWidth: 2,
          borderColor: "white",
          marginTop: 20,
          alignSelf: "center",
        }}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", result: "tmpfile" }}
          style={{ width: CROP_WIDTH, height: CROP_HEIGHT }}
        >
          <GestureDetector gesture={composedGesture}>
            <Animated.Image
              source={{ uri: imageUri }}
              style={[
                {
                  width: CROP_WIDTH,
                  height: CROP_HEIGHT,
                  resizeMode: "cover",
                },
                imageStyle,
              ]}
            />
          </GestureDetector>
        </ViewShot>
      </View>

      {/* 하단 툴바 */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: 24,
          paddingHorizontal: 40,
        }}
      >
        <TouchableOpacity onPress={rotateImage}>
          <MaterialIcons name="rotate-right" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={resetTransform}>
          <MaterialIcons name="refresh" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleAspectRatio}>
          <MaterialIcons name="aspect-ratio" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* 하단 Cancel / Done */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 30,
          paddingTop: 30,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "skyblue", fontSize: 18 }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCapture}>
          <Text style={{ color: "gold", fontSize: 18 }}>Done</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}
