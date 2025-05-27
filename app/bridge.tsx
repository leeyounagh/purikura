import { CustomCropScreen } from "@/components/ui/bridge/customCropScreen";
import React from "react";
import { View } from "react-native";

export default function Bridge() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CustomCropScreen />
    </View>
  );
}
