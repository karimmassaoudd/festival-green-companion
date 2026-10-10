import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TripProvider } from '@/context/TripContext';
import { colors } from '@/utils/theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TripProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </TripProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Checking your account...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={Boolean(session)}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="booking/review" />
        <Stack.Screen name="booking/[bookingId]" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" />
        <Stack.Screen name="sign-up" />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.surface,
  },
  loadingText: { color: colors.textMuted, fontSize: 13 },
});
