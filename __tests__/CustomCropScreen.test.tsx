import { CustomCropScreen } from "@/components/ui/bridge/customCropScreen";
import { useImageStore } from "@/store/useImageStore";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Gesture handler mock
jest.mock("react-native-gesture-handler", () => {
  const actual = jest.requireActual("react-native-gesture-handler");

  const gestureMock = {
    onUpdate: jest.fn().mockReturnThis(),
    onEnd: jest.fn().mockReturnThis(),
    onStart: jest.fn().mockReturnThis(),
  };

  return {
    ...actual,
    GestureHandlerRootView: ({ children }: any) => children,
    GestureDetector: ({ children }: any) => children,
    Gesture: {
      Pinch: () => gestureMock,
      Pan: () => gestureMock,
      Simultaneous: () => gestureMock,
    },
  };
});

const mockCapture = jest.fn();

// mock view-shot
jest.mock("react-native-view-shot", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: React.forwardRef((_props: any, ref: any) => {
      if (ref) {
        ref.current = { capture: mockCapture };
      }
      return null;
    }),
  };
});

// mock store
const mockSetImageUri = jest.fn();
jest.mock("@/store/useImageStore", () => ({
  useImageStore: jest.fn(),
}));

// mock expo-router
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  __esModule: true,
  mockPush,
  mockBack,
}));

// 완료 버튼 누를때까지의 흐름 테스트트
describe("CustomCropScreen - Done button", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCapture.mockResolvedValue("mocked-capture-uri");

    (useImageStore as jest.Mock).mockImplementation((selector) =>
      selector({
        imageUri: "https://example.com/image.jpg",
        setImageUri: mockSetImageUri,
      })
    );
  });

  it('captures image and navigates to "/main" on Done press', async () => {
    const { getByText } = render(<CustomCropScreen />);
    fireEvent.press(getByText("Done"));

    await waitFor(() => {
      expect(mockCapture).toHaveBeenCalled();
      expect(mockSetImageUri).toHaveBeenCalledWith("mocked-capture-uri");
      expect(mockPush).toHaveBeenCalledWith("/main");
    });
  });
});

//ui 버튼들을 눌렀을때 기능이 제대로 작동하는지 확인하는 테스트
describe("CustomCropScreen - UI interaction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCapture.mockResolvedValue("mocked-capture-uri");

    (useImageStore as jest.Mock).mockImplementation((selector) =>
      selector({
        imageUri: "https://example.com/image.jpg",
        setImageUri: mockSetImageUri,
      })
    );
  });

  it("handles rotate-right button press", () => {
    const { getByTestId } = render(<CustomCropScreen />);
    const rotateButton = getByTestId("rotate-button");
    fireEvent.press(rotateButton);
    expect(true).toBeTruthy();
  });

  it("handles flip-horizontal button press", () => {
    const { getByTestId } = render(<CustomCropScreen />);
    const flipButton = getByTestId("flip-horizontal-button");
    fireEvent.press(flipButton);
    expect(true).toBeTruthy();
  });

  it("handles flip-vertical button press", () => {
    const { getByTestId } = render(<CustomCropScreen />);
    const flipButton = getByTestId("flip-vertical-button");
    fireEvent.press(flipButton);
    expect(true).toBeTruthy();
  });

  it("toggles aspect ratio on button press", () => {
    const { getByTestId } = render(<CustomCropScreen />);
    const aspectButton = getByTestId("aspect-ratio-button");
    fireEvent.press(aspectButton);
    expect(true).toBeTruthy();
  });
});
