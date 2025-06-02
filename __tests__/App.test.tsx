import { useImageStore } from "@/store/useImageStore";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import HomeScreen from "../app/index";

// ✅ expo-router 모듈을 mock 처리
jest.mock("expo-router", () => {
  const push = jest.fn();
  return {
    useRouter: () => ({ push }),
    __esModule: true,
    pushMock: push,
  };
});

// ✅ expo-image-picker 모듈을 mock 처리
jest.mock("expo-image-picker", () => ({
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" }) // 카메라 권한 허용
  ),
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" }) // 갤러리 권한 허용
  ),
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "test-camera-image.jpg" }], // 카메라 결과
    })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "test-gallery-image.jpg" }], // 갤러리 결과
    })
  ),
  MediaTypeOptions: {
    Images: "Images",
  },
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    // 테스트 전마다 이미지 URI 초기화 및 push 함수 초기화
    useImageStore.setState({ imageUri: null });
    require("expo-router").pushMock.mockClear();
  });

  // ✅ [테스트 1]
  // "사진 찍기" 버튼을 누르면:
  // - 카메라 실행 함수가 호출되고
  // - 이미지 URI가 상태에 저장되며
  // - "/bridge" 페이지로 이동해야 한다
  it("사진찍기 버튼을 누르면 카메라가 실행되고 상태가 업데이트되며 페이지 이동한다", async () => {
    const { getByTestId } = render(<HomeScreen />);
    const button = getByTestId("open-take-photo-button");
    fireEvent.press(button); // 버튼 클릭 시뮬레이션

    await waitFor(() => {
      const ImagePicker = require("expo-image-picker");
      const { pushMock } = require("expo-router");

      expect(ImagePicker.launchCameraAsync).toHaveBeenCalled(); // 카메라 호출 확인
      expect(useImageStore.getState().imageUri).toBe("test-camera-image.jpg"); // 상태 저장 확인
      expect(pushMock).toHaveBeenCalledWith("/bridge"); // 페이지 이동 확인
    });
  });

  // ✅ [테스트 2]
  // "사진 앨범" 버튼을 누르면:
  // - 갤러리 실행 함수가 호출되고
  // - 이미지 URI가 상태에 저장되며
  // - "/bridge" 페이지로 이동해야 한다
  it("갤러리 버튼을 누르면 앨범이 열리고 상태가 업데이트되며 페이지 이동한다", async () => {
    const { getByTestId } = render(<HomeScreen />);
    const button = getByTestId("open-photoAlbum-button");
    fireEvent.press(button); // 버튼 클릭 시뮬레이션

    await waitFor(() => {
      const ImagePicker = require("expo-image-picker");
      const { pushMock } = require("expo-router");

      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled(); // 갤러리 호출 확인
      expect(useImageStore.getState().imageUri).toBe("test-gallery-image.jpg"); // 상태 저장 확인
      expect(pushMock).toHaveBeenCalledWith("/bridge"); // 페이지 이동 확인
    });
  });
});
