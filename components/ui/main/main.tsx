import { useEditorStore } from "@/store/useEditorStore";
import { useState } from "react";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import EditorCanvas from "../common/editorCanvas";
import { BottomSheetModal } from "../common/modal";
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
  margin-bottom: 50px;
`;

export default function EditorScreen() {
  const [showSheet, setShowSheet] = useState(false);
  const [sheetItems, setSheetItems] = useState<any[]>([]);
  const [sheetType, setSheetType] = useState<string>("");
  const addSticker = useEditorStore((state) => state.addSticker);
  const setFilter = useEditorStore((state) => state.setFilter);
  const setBackgroundUri = useEditorStore((state) => state.setBackgroundUri);
  const [pentoolVisible, setPentoolVisible] = useState(false);
  const [isSave, setIsSave] = useState(false);

  const closePentool = () => {
    setPentoolVisible(false);
  };

  const handleOpenSheet = (type: string) => {
    if (type === "background" || type === "sticker" || type === "filter") {
      setShowSheet(true);
      setSheetType(type);
      setPentoolVisible(false);
      if (type === "background") {
        setSheetItems([
          {
            id: "bg1",
            label: "배경1",
            source: require("../../../assets/images/sample/bg.jpg"),
          },
          {
            id: "bg2",
            label: "배경2",
            source: require("../../../assets/images/sample/bg.jpg"),
          },
        ]);
      } else if (type === "sticker") {
        setSheetItems([
          {
            id: "st1",
            label: "스티커1",
            source: require("../../../assets/images/sample/sticker.png"),
          },
          {
            id: "st2",
            label: "스티커2",
            source: require("../../../assets/images/common/heart.png"),
          },
        ]);
      } else if (type === "filter") {
        setSheetItems([
          {
            id: "f1",
            label: "핑크",
            source: require("../../../assets/images/sample/핑크필터.png"),
          },
          {
            id: "f2",
            label: "빈티지",
            source: require("../../../assets/images/sample/핑크필터.png"),
          },
        ]);
      }
    } else if (type === "pen") {
      setPentoolVisible((prev) => !prev);
      setShowSheet(false);
    } else if (type === "save") {
      setShowSheet(false);
      handleSave();
    } else {
      setShowSheet(false);
    }
  };

  const handleSave = () => {
    setIsSave(!isSave);
  };
  const handleSelectItem = (item: (typeof sheetItems)[0]) => {
    if (sheetType === "background") {
      setBackgroundUri(item.source);
    } else if (sheetType === "sticker") {
      addSticker(item.source);
    } else if (sheetType === "filter") {
      setFilter(item.source);
    }
  };

  return (
    <Container>
      <ContentArea
        source={require("../../../assets/images/common/main/bg/main_bg.jpg")}
        resizeMode="cover"
      >
        <BottomSheetModal visible={showSheet}>
          <ScrollView horizontal>
            {sheetItems.map((i) => (
              <TouchableOpacity key={i.id} onPress={() => handleSelectItem(i)}>
                <Image
                  source={i.source}
                  style={{ width: 80, height: 80, marginHorizontal: 8 }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BottomSheetModal>
        <EditorCanvas
          pentoolVisible={pentoolVisible}
          onPentoolClose={closePentool}
          isSave={isSave}
          onSaveComplete={() => setIsSave(false)}
        />
        <LogoImage source={require("../../../assets/images/common/icon.png")} />
      </ContentArea>

      <TabBar onOpenModal={handleOpenSheet} />
    </Container>
  );
}
