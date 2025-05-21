import { router } from 'expo-router';
import { Button, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Bridge 페이지로 이동"
        onPress={() => router.push('/bridge')}
      />

      <View style={{ height: 10 }} />

      <Button
        title="Main 페이지로 이동"
        onPress={() => router.push('/main')}
      />
    </View>
  );
}
