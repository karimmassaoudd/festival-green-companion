import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/utils/theme';

type AppHeaderProps = {
  title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Ionicons name="leaf-outline" size={21} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.eyebrow}>ITERATION 3 · FINAL</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable accessibilityLabel="Notifications" style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={20} color={colors.text} />
        </Pressable>
        <Pressable accessibilityLabel="Profile" style={[styles.iconButton, styles.profileButton]}>
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
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  title: {
    marginTop: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
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
});
