import { useImageStore } from "@/store/useImageStore";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import ActionButtons from "./buttonContainer";
import Logo from "./logo";

const Background = styled.ImageBackground`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 80px;
`;

export default function HomeContainer() {
  const router = useRouter();
  const setImageUri = useImageStore((state) => state.setImageUri);

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
      setImageUri(image.uri);
      router.push("/bridge");
    }
  };
  return (
    <Background
      source={require("../../../assets/images/common/home/bg/bg.png")}
      resizeMode="cover"
    >
      <Container>
        <Logo />
        <ActionButtons
          onTakePhoto={handleTakePhoto}
          onSelectAlbum={handleSelectAlbum}
        />
      </Container>
    </Background>
  );
}
