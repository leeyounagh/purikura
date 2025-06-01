import { useImageStore } from "@/store/useImageStore";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import HomeScreen from "../app/index";

// expo-router 모킹
jest.mock("expo-router", () => {
  const push = jest.fn();
  return {
    useRouter: () => ({ push }),
    __esModule: true,
    pushMock: push,
  };
});

// expo-image-picker 모킹
jest.mock("expo-image-picker", () => ({
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "test-camera-image.jpg" }],
    })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "test-gallery-image.jpg" }],
    })
  ),
  MediaTypeOptions: {
    Images: "Images",
  },
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    useImageStore.setState({ imageUri: null });
    require("expo-router").pushMock.mockClear();
  });
  //   사진찍기 버튼을 누르면 카메라 화면이 나오고, 사진이 찍히면 zustand store에 이미지 URI가 저장되며, 브릿지 화면으로 이동하는지 테스트합니다.
  it("calls camera when take photo button is pressed", async () => {
    const { getByTestId } = render(<HomeScreen />);
    const button = getByTestId("open-take-photo-button");
    fireEvent.press(button);

    await waitFor(() => {
      const ImagePicker = require("expo-image-picker");
      const { pushMock } = require("expo-router");

      expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
      expect(useImageStore.getState().imageUri).toBe("test-camera-image.jpg");
      expect(pushMock).toHaveBeenCalledWith("/bridge");
    });
  });
  //   갤러리 버튼을 누르면 갤러리 화면이 나오고, 사진이 선택되면 zustand store에 이미지 URI가 저장되며, 브릿지 화면으로 이동하는지 테스트합니다.
  it("calls gallery when photo album button is pressed", async () => {
    const { getByTestId } = render(<HomeScreen />);
    const button = getByTestId("open-photoAlbum-button");
    fireEvent.press(button);

    await waitFor(() => {
      const ImagePicker = require("expo-image-picker");
      const { pushMock } = require("expo-router");

      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
      expect(useImageStore.getState().imageUri).toBe("test-gallery-image.jpg");
      expect(pushMock).toHaveBeenCalledWith("/bridge");
    });
  });
});
