import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { TripProvider } from '@/context/TripContext';

export default function RootLayout() {
  return (
    <TripProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </TripProvider>
  );
}
