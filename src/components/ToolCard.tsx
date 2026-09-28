import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FestivalTool } from '@/types/models';
import { cardShadow, colors, radius, spacing } from '@/utils/theme';

type ToolCardProps = {
  tool: FestivalTool;
  onPress: () => void;
};

export function ToolCard({ tool, onPress }: ToolCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name={tool.icon} size={21} color={colors.primary} />
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{tool.badge}</Text>
        </View>
      </View>
      <Text style={styles.title}>{tool.title}</Text>
      <Text style={styles.subtitle}>{tool.subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.2%',
    minHeight: 142,
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...cardShadow,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  iconCircle: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: colors.primarySoft,
  },
  badge: {
    maxWidth: 74,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: radius.round,
    backgroundColor: colors.lavender,
  },
  badgeText: {
    color: colors.primaryDark,
    fontSize: 8,
    fontWeight: '800',
  },
  title: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
