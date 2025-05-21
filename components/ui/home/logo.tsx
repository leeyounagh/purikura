import styled from 'styled-components/native';

const LogoWrapper = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  padding-top: 100px;
`;

const HeartImage = styled.Image`
  width: 108px;
  height: 109px;
`;

const TextImage = styled.Image`
  width: 250px;
  height: 72px;
  resize-mode: contain;
  margin-bottom:130px;
`;

export default function Logo() {
  return (
    <LogoWrapper>
      <HeartImage source={require('../../../assets/images/common/heart.png')} />
      <TextImage source={require('../../../assets/images/common/icon.png')} />
    </LogoWrapper>
  );
}
