import { StickerItem } from "@/components/ui/common/editorCanvas/StickerItem";
import { useEditorStore } from "@/store/useEditorStore";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// 스토어 mock
jest.mock("@/store/useEditorStore", () => ({
  useEditorStore: jest.fn(),
}));

// 아이콘 mock
jest.mock("@expo/vector-icons", () => {
  return {
    MaterialIcons: () => null,
    MaterialCommunityIcons: () => null,
  };
});

// mock 핸들러
const mockUpdatePosition = jest.fn();
const mockUpdateScale = jest.fn();
const mockRemoveSticker = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  (useEditorStore as jest.Mock).mockImplementation((selector) =>
    selector({
      updateStickerPosition: mockUpdatePosition,
      updateStickerScale: mockUpdateScale,
      removeSticker: mockRemoveSticker,
    })
  );
});

describe("StickerItem", () => {
  const baseProps = {
    id: "sticker1",
    source: { uri: "https://example.com/sticker.png" },
    x: 0,
    y: 0,
    scale: 1,
    isSelected: true,
    onSelect: jest.fn(),
  };

  it("렌더링 시 이미지와 삭제 버튼, 회전, 사이즈 확대 축소 버튼이 표시된다", () => {
    const { getByTestId } = render(<StickerItem {...baseProps} />);
    expect(getByTestId("sticker-image")).toBeTruthy();
    expect(getByTestId("delete-button")).toBeTruthy();
    expect(getByTestId("rotate-icon")).toBeTruthy();
    expect(getByTestId("resize-icon")).toBeTruthy();
  });

  it("스티커를 클릭하면 onSelect가 호출된다", () => {
    const { getByTestId } = render(<StickerItem {...baseProps} />);
    fireEvent.press(getByTestId("sticker-image"));
    expect(baseProps.onSelect).toHaveBeenCalledWith("sticker1");
  });

  it("삭제 버튼을 누르면 removeSticker가 호출된다", () => {
    const { getByTestId } = render(<StickerItem {...baseProps} />);
    fireEvent.press(getByTestId("delete-button"));

    expect(mockRemoveSticker).toHaveBeenCalledWith("sticker1");
  });

  it("회전 및 크기 조절 핸들러가 존재한다", () => {
    const { getByTestId } = render(<StickerItem {...baseProps} />);
    expect(getByTestId("rotate-icon")).toBeTruthy();
    expect(getByTestId("resize-icon")).toBeTruthy();
  });
});
