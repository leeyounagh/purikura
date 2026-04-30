import { useImageStore } from "@/store/useImageStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const flipX = useSharedValue(1);
  const flipY = useSharedValue(1);

  const [aspectRatio, setAspectRatio] = useState({ width: 3, height: 4 });
  const [isRemovingBg, setIsRemovingBg] = useState(false);

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
    translateX.value = e.translationX * flipX.value;
    translateY.value = e.translationY * flipY.value;
  });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: flipX.value },
      { scaleY: flipY.value },
      { scale: baseScale.value * pinchScale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const CROP_WIDTH = SCREEN_WIDTH;
  const CROP_HEIGHT = SCREEN_WIDTH * (aspectRatio.height / aspectRatio.width);

  const onCapture = async () => {
    if (Platform.OS === "web") {
      router.push("/main");
      return;
    }
    if (viewShotRef.current?.capture) {
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
    flipX.value = withTiming(1);
    flipY.value = withTiming(1);
    baseScale.value = 1;
    pinchScale.value = 1;
  };

  const rotateImage = () => {
    rotation.value = withTiming((rotation.value + 90) % 360);
  };

  const flipHorizontally = () => {
    flipX.value = withTiming(flipX.value === 1 ? -1 : 1);
  };

  const flipVertically = () => {
    flipY.value = withTiming(flipY.value === 1 ? -1 : 1);
  };

  const removeBackground = async () => {
    if (!imageUri || isRemovingBg) return;

    const apiKey = process.env.EXPO_PUBLIC_REMOVE_BG_API_KEY;
    if (!apiKey) {
      Alert.alert("API 키 없음", "EXPO_PUBLIC_REMOVE_BG_API_KEY를 설정하세요.");
      return;
    }

    try {
      setIsRemovingBg(true);

      const formData = new FormData();
      if (Platform.OS === "web") {
        const blob = await (await fetch(imageUri)).blob();
        formData.append("image_file", blob, "image.png");
      } else {
        formData.append("image_file", {
          uri: imageUri,
          name: "image.png",
          type: "image/png",
        } as any);
      }
      formData.append("size", __DEV__ ? "preview" : "auto");

      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": apiKey },
        body: formData,
      });

      if (!res.ok) {
        console.warn("[removeBg] failed", res.status, await res.text());
        Alert.alert(
          "알림",
          "해당 기능은 현재 이용할 수 없습니다.\n잠시 후 다시 시도해 주세요."
        );
        return;
      }

      const blob = await res.blob();
      const dataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      setImageUri(dataUri);
    } catch (e) {
      console.warn("[removeBg] error", e);
      Alert.alert(
        "알림",
        "해당 기능은 현재 이용할 수 없습니다.\n잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsRemovingBg(false);
    }
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
        {isRemovingBg && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="white" />
            <Text style={{ color: "white", marginTop: 8 }}>
              배경 제거 중...
            </Text>
          </View>
        )}
      </View>

      {/* 하단 툴바 */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: 24,
          paddingHorizontal: 10,
        }}
      >
        <TouchableOpacity onPress={rotateImage} testID="rotate-button">
          <MaterialIcons name="rotate-right" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={resetTransform}>
          <MaterialIcons name="refresh" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleAspectRatio}
          testID="aspect-ratio-button"
        >
          <MaterialIcons name="aspect-ratio" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={flipHorizontally}
          testID="flip-horizontal-button"
        >
          <MaterialIcons name="flip" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={flipVertically}
          testID="flip-vertical-button"
        >
          <MaterialIcons
            name="flip"
            size={28}
            color="white"
            style={{ transform: [{ rotate: "90deg" }] }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={removeBackground}
          disabled={isRemovingBg}
          testID="remove-bg-button"
        >
          <MaterialIcons
            name="auto-fix-high"
            size={28}
            color={isRemovingBg ? "gray" : "white"}
          />
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
