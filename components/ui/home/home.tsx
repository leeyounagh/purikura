import styled from 'styled-components/native';
import ActionButtons from './buttonContainer';
import Logo from './logo';

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
  const handleTakePhoto = () => {
    console.log('카메라 페이지로 이동');
  };

  const handleSelectAlbum = () => {
    console.log('앨범 페이지로 이동');
  };

  return (
    <Background
      source={require('../../../assets/images/common/home/bg/bg.jpg')}
      resizeMode="cover"
    >
      <Container>
        <Logo></Logo>
        <ActionButtons
          onTakePhoto={handleTakePhoto}
          onSelectAlbum={handleSelectAlbum}
        />
      </Container>
    </Background>
  );
}
