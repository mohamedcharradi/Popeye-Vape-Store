import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Role Selection', headerShown: false } } />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="vender" options={{ headerShown: false }} />
      </Stack>
    </>
  );
} 