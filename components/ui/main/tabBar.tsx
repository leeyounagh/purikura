import { router } from "expo-router";
import React from "react";
import { ImageBackground, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const TabWrapper = styled(ImageBackground)`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-top-width: 1px;
  border-color: #ccc;
  height: 80px;
  width: 100%;
`;
const TabButton = styled(TouchableOpacity)`
  align-items: center;
  gap: 4px;
`;

const TabIcon = styled.Image`
  width: 38px;
  height: 38px;
  resize-mode: contain;
`;

type Props = {
  onOpenModal: (
    type: "background" | "sticker" | "filter" | "pen" | "save"
  ) => void;
};

export default function TabBar({ onOpenModal }: Props) {
  return (
    <TabWrapper
      source={require("../../../assets/images/common/main/bg/tab_bg.jpg")}
      resizeMode="cover"
    >
      <TabButton onPress={() => router.push("/")}>
        <TabIcon
          source={require("../../../assets/images/common/main/button/home3.png")}
        />
      </TabButton>

      <TabButton onPress={() => onOpenModal("background")}>
        <TabIcon
          source={require("../../../assets/images/common/main/button/background3.png")}
        />
      </TabButton>

      <TabButton onPress={() => onOpenModal("sticker")}>
        <TabIcon
          source={require("../../../assets/images/common/main/button/sticker3.png")}
        />
      </TabButton>

      <TabButton onPress={() => onOpenModal("pen")}>
        <TabIcon
          source={require("../../../assets/images/common/main/button/pen3.png")}
        />
      </TabButton>

      <TabButton onPress={() => onOpenModal("filter")}>
        <TabIcon
          source={require("../../../assets/images/common/main/button/filter3.png")}
        />
      </TabButton>

      <TabButton onPress={() => onOpenModal("save")}>
        <TabIcon
          source={require("../../../assets/images/common/main/button/save3.png")}
        />
      </TabButton>
    </TabWrapper>
  );
}
