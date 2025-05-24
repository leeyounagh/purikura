import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="bridge" options={{ headerShown: false }} />
          <Stack.Screen name="main" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
