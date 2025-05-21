import HomeContainer from '@/components/ui/home/home';
import { router } from 'expo-router';
import { Button, View } from 'react-native';


export default function HomeScreen() {
      const handleGoToMain = () => {
    router.push('/main');
  };
  return (
   <View style={{ flex: 1 }}>
      <HomeContainer />

      {/* 아래는 임시 이동용 버튼 */}
      <Button title="Go to Main" onPress={handleGoToMain} />
    </View>
  );
}
