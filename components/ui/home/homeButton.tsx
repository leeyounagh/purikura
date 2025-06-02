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
  testID:string;
};

export default function HomeButton({ icon, onPress,testID }: Props) {
  return (
    <ButtonBox onPress={onPress} testID={testID}> 
      <ButtonImage source={icon}  />
    </ButtonBox>
  );
}
