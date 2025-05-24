// components/editorCanvas/filterLayer.tsx
import { useEditorStore } from "@/store/useEditorStore";
import React from "react";
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
  return filter ? <FilterImage source={filter} /> : null;
}
