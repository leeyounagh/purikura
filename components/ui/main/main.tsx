import { useState } from "react";
import styled from "styled-components/native";
import EditorCanvas from "../common/editorCanvas";
import TabBar from "./tabBar";

const Container = styled.View`
  flex: 1;
  position: relative;
`;

export const ContentArea = styled.ImageBackground`
  flex: 1;
  width: 100%;
`;

const LogoImage = styled.Image`
  width: 250px;
  justify-content: center;
  align-items: center;
  height: 72px;
  resize-mode: contain;
  align-self: center;
  margin-bottom:50px;
`;

export default function EditorScreen() {
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleSave = () => {
    console.log("저장 기능 실행");
  };

  return (
    <Container>
      <ContentArea
        source={require("../../../assets/images/common/main/bg/main_bg.jpg")}
        resizeMode="cover"
      >
        <EditorCanvas />
        <LogoImage source={require("../../../assets/images/common/icon.png")} />
      </ContentArea>

      <TabBar
        onOpenModal={(type) => {
          if (type === "background") setShowBackgroundModal(true);
          if (type === "sticker") setShowStickerModal(true);
          if (type === "filter") setShowFilterModal(true);
        }}
        onSave={handleSave}
      />
    </Container>
  );
}
