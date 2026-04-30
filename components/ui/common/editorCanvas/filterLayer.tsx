// components/editorCanvas/filterLayer.tsx
import { useEditorStore } from "@/store/useEditorStore";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

const FilterImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  resize-mode: cover;
  opacity: 0.3;
  pointer-events: none;
`;

export function FilterLayer() {
  const filter = useEditorStore((state) => state.filter);
  if (!filter) return null;

  if ("source" in filter) {
    return <FilterImage source={filter.source} testID="filter-image" />;
  }

  if (filter.type === "solid") {
    return (
      <View
        testID="filter-solid"
        pointerEvents="none"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: filter.color,
          opacity: filter.opacity,
        }}
      />
    );
  }

  return (
    <LinearGradient
      testID="filter-gradient"
      colors={filter.colors}
      start={filter.start ?? { x: 0, y: 0 }}
      end={filter.end ?? { x: 0, y: 1 }}
      pointerEvents="none"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: filter.opacity,
      }}
    />
  );
}
