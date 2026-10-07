import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/utils/theme';

type AppHeaderProps = {
  title: string;
  onNotifications: () => void;
  onProfile: () => void;
};

export function AppHeader({ title, onNotifications, onProfile }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Ionicons name="musical-notes" size={19} color={colors.surface} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
          onPress={onNotifications}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.text} />
          <View style={styles.notificationDot} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={onProfile}
          style={({ pressed }) => [styles.iconButton, styles.profileButton, pressed && styles.pressed]}
        >
          <Ionicons name="person-outline" size={18} color={colors.surface} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.coral,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.round,
  },
  profileButton: { backgroundColor: colors.primary },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderWidth: 1,
    borderColor: colors.background,
    borderRadius: 4,
    backgroundColor: colors.amber,
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.94 }] },
});
