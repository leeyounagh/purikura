import { useEditorStore } from "@/store/useEditorStore";
import { useState } from "react";
import { FlatList, Image, ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import EditorCanvas from "../common/editorCanvas";
import { BottomSheetModal } from "../common/modal";
import TabBar from "./tabBar";
import { bgs, stickers } from "./utils/images";

const Container = styled.View`
  flex: 1;
  position: relative;
`;

export const ContentArea = styled.ImageBackground`
  flex: 1;
  width: 100%;
`;
const LogoImageContainer = styled.View`
  position: absolute;
  bottom: 0px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.Image`
  width: 250px;
  height: 72px;
  resize-mode: contain;
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
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  const closePentool = () => {
    setPentoolVisible(false);
  };

  const handleOpenSheet = (type: string) => {
    if (type === "background" || type === "sticker" || type === "filter") {
      setShowSheet(true);
      setSheetType(type);
      setPentoolVisible(false);
      if (type === "background") {
        setPage(1);
        setSheetItems(bgs.slice(0, ITEMS_PER_PAGE));
      } else if (type === "sticker") {
        setPage(1);
        setSheetItems(stickers.slice(0, ITEMS_PER_PAGE));
      } else if (type === "filter") {
        setSheetItems([
          {
            id: "f1",
            label: "핑크",
            source: require("../../../assets/images/common/filter/핑크필터.png"),
          },
          {
            id: "f2",
            label: "흰색",
            source: require("../../../assets/images/common/filter/흰색필터.png"),
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
  const loadMoreItems = () => {
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * ITEMS_PER_PAGE;

    if (sheetType === "sticker") {
      if (end <= stickers.length) {
        const nextItems = stickers.slice(start, end);
        setSheetItems(nextItems);
        setPage(nextPage);
      }
    } else if (sheetType === "background") {
      if (end <= bgs.length) {
        const nextItems = bgs.slice(start, end);
        setSheetItems(nextItems);
        setPage(nextPage);
      }
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
          <BottomSheetModal visible={showSheet}>
            {sheetType === "filter" ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {sheetItems.map((i) => (
                  <TouchableOpacity
                    key={i.id}
                    onPress={() => handleSelectItem(i)}
                  >
                    <Image
                      source={i.source}
                      style={{
                        width: 80,
                        height: 80,
                        marginHorizontal: 8,
                        resizeMode: "contain",
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <FlatList
                horizontal
                data={sheetItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectItem(item)}>
                    <Image
                      source={item.source}
                      style={{
                        width: 80,
                        height: 80,
                        marginHorizontal: 8,
                        resizeMode: "contain",
                      }}
                    />
                  </TouchableOpacity>
                )}
                onEndReached={loadMoreItems}
                onEndReachedThreshold={0.5}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </BottomSheetModal>
        </BottomSheetModal>
        <EditorCanvas
          pentoolVisible={pentoolVisible}
          onPentoolClose={closePentool}
          isSave={isSave}
          onSaveComplete={() => setIsSave(false)}
        />
        <LogoImageContainer>
          <LogoImage
            source={require("../../../assets/images/common/icon.png")}
          />
        </LogoImageContainer>
      </ContentArea>

      <TabBar onOpenModal={handleOpenSheet} />
    </Container>
  );
}
