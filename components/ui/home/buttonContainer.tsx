import styled from "styled-components/native";
import HomeButton from "./homeButton";

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
`;

export default function ActionButtons({
  onTakePhoto,
  onSelectAlbum,
}: {
  onTakePhoto: () => void;
  onSelectAlbum: () => void;
}) {
  return (
    <ButtonContainer>
      <HomeButton
        testID={"open-take-photo-button"}
        icon={require("../../../assets/images/common/home/button/take_photo.png")}
        onPress={onTakePhoto}
      />
      <HomeButton
        testID={"open-photoAlbum-button"}
        icon={require("../../../assets/images/common/home/button/photoAlbum.png")}
        onPress={onSelectAlbum}
      />
    </ButtonContainer>
  );
}
