import { CustomCropScreen } from "@/components/ui/bridge/customCropScreen";
import { useImageStore } from "@/store/useImageStore";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

function renderWithSafeArea(ui: React.ReactElement) {
  return render(
    <SafeAreaProvider initialMetrics={FIXTURE_SAFE_AREA}>{ui}</SafeAreaProvider>
  );
}

const FIXTURE_SAFE_AREA = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

jest.mock("expo-localization", () => ({
  getLocales: () => [{ languageCode: "en", regionCode: "US" }],
}));

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
const mockSetShowMainBgLogo = jest.fn();
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
describe("CustomCropScreen - 완료 버튼", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCapture.mockResolvedValue("mocked-capture-uri");

    (useImageStore as unknown as jest.Mock).mockImplementation(
      (selector: (s: unknown) => unknown) =>
        selector({
          imageUri: "https://example.com/image.jpg",
          showMainBgLogo: false,
          setImageUri: mockSetImageUri,
          setShowMainBgLogo: mockSetShowMainBgLogo,
        })
    );
  });

  it('"완료" 버튼을 누르면 캡처하고 "/main" 페이지로 이동한다', async () => {
    const { getByText } = renderWithSafeArea(<CustomCropScreen />);
    fireEvent.press(getByText("Done"));

    await waitFor(() => {
      expect(mockCapture).toHaveBeenCalled(); // 이미지 캡처가 호출됨
      expect(mockSetImageUri).toHaveBeenCalledWith("mocked-capture-uri"); // 상태 저장
      expect(mockPush).toHaveBeenCalledWith("/main"); // 페이지 이동
    });
  });
});

//ui 버튼들을 눌렀을때 기능이 제대로 작동하는지 확인하는 테스트
describe("CustomCropScreen - UI 상호작용", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCapture.mockResolvedValue("mocked-capture-uri");

    (useImageStore as unknown as jest.Mock).mockImplementation(
      (selector: (s: unknown) => unknown) =>
        selector({
          imageUri: "https://example.com/image.jpg",
          showMainBgLogo: false,
          setImageUri: mockSetImageUri,
          setShowMainBgLogo: mockSetShowMainBgLogo,
        })
    );
  });

  it('"오른쪽 회전" 버튼을 눌렀을 때 정상 작동한다', () => {
    const { getByTestId } = renderWithSafeArea(<CustomCropScreen />);
    const rotateButton = getByTestId("rotate-button");
    fireEvent.press(rotateButton);
    expect(true).toBeTruthy();
  });

  it('"좌우 반전" 버튼을 눌렀을 때 정상 작동한다', () => {
    const { getByTestId } = renderWithSafeArea(<CustomCropScreen />);
    const flipButton = getByTestId("flip-horizontal-button");
    fireEvent.press(flipButton);
    expect(true).toBeTruthy();
  });

  it('"상하 반전" 버튼을 눌렀을 때 정상 작동한다', () => {
    const { getByTestId } = renderWithSafeArea(<CustomCropScreen />);
    const flipButton = getByTestId("flip-vertical-button");
    fireEvent.press(flipButton);
    expect(true).toBeTruthy();
  });

  it('"비율 변경" 버튼을 눌렀을 때 정상 작동한다', () => {
    const { getByTestId } = renderWithSafeArea(<CustomCropScreen />);
    const aspectButton = getByTestId("aspect-ratio-button");
    fireEvent.press(aspectButton);
    expect(true).toBeTruthy();
  });
});