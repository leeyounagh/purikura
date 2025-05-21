import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const ButtonBox = styled(TouchableOpacity)`
  align-items: center;
  border-radius: 8px;
  width: 140px;
  height:145px;
  border:3px solid black;
  background-color: white;
  padding: 10px;
`;
const ButtonImage = styled.Image`
  width: 90%;
  height: 100%;
  resize-mode: contain;

`;



type Props = {
  icon: any; 
  onPress: () => void;
};

export default function HomeButton({ icon, onPress }: Props) {
  return (
    <ButtonBox onPress={onPress}>
      <ButtonImage source={icon}  />
    </ButtonBox>
  );
}
