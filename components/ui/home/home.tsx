import { useEditorStore } from "@/store/useEditorStore";
import { useImageStore } from "@/store/useImageStore";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";
import ActionButtons from "./buttonContainer";
import Logo from "./logo";

/** stretch 자식 → 하단 padding 이 실제 화면 아래에서 먹도록 함 (center 는 일부 기기에서 겹침 유발) */
const Background = styled.ImageBackground`
  flex: 1;
  width: 100%;
`;

const Container = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;
const VersionText = styled.Text`
  margin-top: 16px;
  font-size: 14px;
  color: #444;
  opacity: 0.7;
`;

export default function HomeContainer() {
  const insets = useSafeAreaInsets();
  /**
   * 하단 내비 겹침: insets.bottom 이 거의 안 오는 기기만 큰 폴백.
   * 정상 인셋이 오는 폰은 insets + 여백만 써서 레이아웃이 과하게 뜨지 않게 함.
   */
  const paddingBottom =
    Platform.OS === "android"
      ? insets.bottom < 20
        ? Math.max(88, insets.bottom + 44)
        : insets.bottom + 24
      : Math.max(28, insets.bottom + 20);
  const router = useRouter();
  const setImageUri = useImageStore((state) => state.setImageUri);
  const setShowMainBgLogo = useImageStore(
    (state) => state.setShowMainBgLogo
  );
  const resetEditor = useEditorStore((state) => state.resetEditor);

  useFocusEffect(
    useCallback(() => {
      resetEditor();
    }, [resetEditor])
  );

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("카메라 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      const image = result.assets[0];
      setShowMainBgLogo(false);
      setImageUri(image.uri);
      router.push("/bridge");
    }
  };
  const handleSelectAlbum = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("갤러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      const image = result.assets[0];
      setShowMainBgLogo(false);
      setImageUri(image.uri);
      router.push("/bridge");
    }
  };
  return (
    <Background
      source={require("../../../assets/images/common/home/bg/bg.png")}
      resizeMode="cover"
    >
      <Container
        style={{
          flex: 1,
          paddingTop: Math.max(80, insets.top + 48),
          paddingBottom,
        }}
      >
        <Logo />
        <ActionButtons
          onTakePhoto={handleTakePhoto}
          onSelectAlbum={handleSelectAlbum}
        />
        <VersionText>v{Constants.expoConfig?.version}</VersionText>
      </Container>
    </Background>
  );
}
