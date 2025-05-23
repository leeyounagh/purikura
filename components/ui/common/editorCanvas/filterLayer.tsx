// components/editorCanvas/filterLayer.tsx
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
  return (
    <FilterImage
      source={require("../../../../assets/images/sample/핑크필터.png")} 
    />
  );
}
