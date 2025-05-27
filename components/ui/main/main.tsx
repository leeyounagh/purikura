import { useEditorStore } from "@/store/useEditorStore";
import { useEffect, useRef, useState } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import EditorCanvas from "../common/editorCanvas";
import { BottomSheetModal } from "../common/modal";
import TabBar from "./tabBar";
import { bgs, filters, stickers } from "./utils/images";

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
  const flatListRef = useRef<FlatList>(null);

  const closePentool = () => {
    setPentoolVisible(false);
  };

  useEffect(() => {
    if (["background", "sticker", "filter"].includes(sheetType)) {
      flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
    }
  }, [sheetType]);

  const handleOpenSheet = (type: string) => {
    const isSheetType = ["background", "sticker", "filter"].includes(type);

    if (isSheetType) {
      setPage(1);
      setShowSheet(true);
      setSheetType(type);
      setPentoolVisible(false);

      const dataMap: Record<string, any[]> = {
        background: bgs,
        sticker: stickers,
        filter: filters,
      };

      const initialItems = dataMap[type].slice(0, ITEMS_PER_PAGE);
      setSheetItems(initialItems);

      setTimeout(() => {
        loadMoreItems();
      }, 100);
      return;
    }

    if (type === "pen") {
      setPentoolVisible((prev) => !prev);
      setShowSheet(false);
      return;
    }

    if (type === "save") {
      setShowSheet(false);
      handleSave();
      return;
    }

    setShowSheet(false);
  };

  const loadMoreItems = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * ITEMS_PER_PAGE;
    const end = nextPage * ITEMS_PER_PAGE;

    const dataMap: Record<string, any[]> = {
      sticker: stickers,
      background: bgs,
      filter: filters,
    };

    const items = dataMap[sheetType];
    if (!items) return;

    if (end > sheetItems.length && start < items.length) {
      const nextItems = items.slice(0, end);
      setSheetItems(nextItems);
      setPage(nextPage);
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
  console.log("sheetItems", sheetItems);
  console.log("sheetType", sheetType);
  return (
    <Container>
      <ContentArea
        source={require("../../../assets/images/common/main/bg/main_bg.jpg")}
        resizeMode="cover"
      >
        <BottomSheetModal visible={showSheet}>
          <FlatList
            horizontal
            ref={flatListRef}
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
