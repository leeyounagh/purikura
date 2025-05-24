import { useEditorStore } from "@/store/useEditorStore";
import React from "react";
import styled from "styled-components/native";

const Background = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

export const BackgroundImage = () => {
  const backgroundUri = useEditorStore((state) => state.backgroundUri);

  return backgroundUri ? <Background source={backgroundUri} /> : null;
};
