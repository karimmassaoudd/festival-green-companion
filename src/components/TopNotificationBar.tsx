import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import { useTrip } from '@/context/TripContext';

type TopNotificationBarProps = {
  message?: string;
};

export function TopNotificationBar({
  message = 'Travel updates and booking alerts appear here',
}: TopNotificationBarProps) {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const { refreshSession, user } = useAuth();
  const { bookingByTravelOptionId, retry } = useTrip();
  const bookingCount = Object.keys(bookingByTravelOptionId).length;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  async function refreshApp() {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setRefreshMessage('Refreshing app data...');

    const authResult = await refreshSession();
    if (authResult.error) {
      setRefreshMessage('Refresh failed. Try again.');
      setIsRefreshing(false);
      return;
    }

    await retry();
    setRefreshMessage('Ready to choose another journey');
    setIsRefreshing(false);
    if (user) router.replace('/travel');
  }

  return (
    <View
      accessibilityRole="summary"
      style={[styles.bar, { backgroundColor: colors.primarySoft, borderBottomColor: colors.border }]}
    >
      <View style={[styles.bell, { backgroundColor: colors.surface }]}>
        <Ionicons name="notifications-outline" size={17} color={colors.primary} />
        <View style={[styles.dot, { backgroundColor: colors.coral, borderColor: colors.surface }]} />
      </View>
      <Text numberOfLines={1} style={[styles.message, { color: colors.text }]}>
        {refreshMessage ?? (bookingCount > 0
          ? `${bookingCount} booking${bookingCount === 1 ? '' : 's'} saved`
          : message)}
      </Text>
      {user ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${bookingCount} saved bookings. Open travel bookings`}
          onPress={() => router.navigate('/travel')}
          hitSlop={8}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="bag-handle-outline" size={17} color={colors.primary} />
          {bookingCount > 0 ? (
            <View style={[styles.countBadge, { backgroundColor: colors.coral, borderColor: colors.surface }]}>
              <Text style={styles.countText}>{bookingCount}</Text>
            </View>
          ) : null}
        </Pressable>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Refresh all app data"
        accessibilityState={{ busy: isRefreshing, disabled: isRefreshing }}
        disabled={isRefreshing}
        onPress={() => void refreshApp()}
        hitSlop={8}
        style={({ pressed }) => [
          styles.actionButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && styles.pressed,
        ]}
      >
        {isRefreshing ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="refresh-outline" size={18} color={colors.primary} />
        )}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        onPress={toggleTheme}
        hitSlop={8}
        style={({ pressed }) => [
          styles.actionButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={18} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bell: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  dot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 6,
    height: 6,
    borderWidth: 1,
    borderRadius: 3,
  },
  message: { flex: 1, fontSize: 10.5, fontWeight: '600' },
  actionButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 16,
  },
  countBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderRadius: 8,
  },
  countText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800' },
  pressed: { opacity: 0.65 },
});
