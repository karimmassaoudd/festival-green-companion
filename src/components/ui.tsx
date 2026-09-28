import Ionicons from '@expo/vector-icons/Ionicons';
import { PropsWithChildren, ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { IconName } from '@/types/models';
import { cardShadow, colors, radius, spacing } from '@/utils/theme';

type PanelProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Panel({ children, style }: PanelProps) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

type PillProps = {
  label: string;
  icon?: IconName;
  tone?: 'green' | 'lavender' | 'amber' | 'white';
  compact?: boolean;
};

export function Pill({ label, icon, tone = 'green', compact = false }: PillProps) {
  return (
    <View style={[styles.pill, styles[`${tone}Pill`], compact && styles.compactPill]}>
      {icon ? <Ionicons name={icon} size={compact ? 11 : 13} color={pillTextColors[tone]} /> : null}
      <Text style={[styles.pillText, { color: pillTextColors[tone] }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

type SectionTitleProps = {
  title: string;
  action?: string;
  icon?: IconName;
};

export function SectionTitle({ title, action, icon }: SectionTitleProps) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionTitleLeft}>
        {icon ? <Ionicons name={icon} size={19} color={colors.primary} /> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

type PrimaryButtonProps = {
  label: string;
  icon?: IconName;
  variant?: 'primary' | 'soft';
  disabled?: boolean;
  onPress: () => void;
};

export function PrimaryButton({
  label,
  icon = 'arrow-forward',
  variant = 'primary',
  disabled = false,
  onPress,
}: PrimaryButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        isPrimary ? styles.primaryButtonGreen : styles.primaryButtonSoft,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={icon} size={18} color={isPrimary ? colors.surface : colors.primary} />
      <Text style={[styles.primaryButtonText, !isPrimary && styles.primaryButtonTextSoft]}>
        {label}
      </Text>
    </Pressable>
  );
}

type ActionChipProps = {
  label: string;
  icon?: IconName;
  selected?: boolean;
  onPress: () => void;
};

export function ActionChip({ label, icon, selected = false, onPress }: ActionChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionChip,
        selected && styles.actionChipSelected,
        pressed && styles.pressed,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={14} color={selected ? colors.surface : colors.primary} />
      ) : null}
      <Text style={[styles.actionChipText, selected && styles.actionChipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

type MetricTileProps = {
  label: string;
  value: string;
  icon?: IconName;
  accent?: boolean;
  trailing?: ReactNode;
};

export function MetricTile({ label, value, icon, accent = false, trailing }: MetricTileProps) {
  return (
    <View style={[styles.metricTile, accent && styles.metricTileAccent]}>
      {icon ? (
        <View style={styles.metricIcon}>
          <Ionicons name={icon} size={17} color={colors.primary} />
        </View>
      ) : null}
      <View style={styles.metricText}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={[styles.metricValue, accent && styles.metricValueAccent]}>{value}</Text>
      </View>
      {trailing}
    </View>
  );
}

const pillTextColors = {
  green: colors.primaryDark,
  lavender: '#3E4651',
  amber: '#76520E',
  white: colors.primaryDark,
} as const;

const styles = StyleSheet.create({
  panel: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...cardShadow,
  },
  pill: {
    minHeight: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 10,
    borderRadius: radius.round,
  },
  compactPill: {
    minHeight: 22,
    paddingHorizontal: 8,
  },
  greenPill: { backgroundColor: colors.primarySoft },
  lavenderPill: { backgroundColor: colors.lavender },
  amberPill: { backgroundColor: colors.amberSoft },
  whitePill: { backgroundColor: colors.surface },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionAction: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  primaryButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.round,
    ...cardShadow,
  },
  primaryButtonGreen: { backgroundColor: colors.primary },
  primaryButtonSoft: { backgroundColor: colors.lavender },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButtonTextSoft: { color: colors.primaryDark },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.48 },
  actionChip: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.round,
    backgroundColor: colors.surfaceMuted,
  },
  actionChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  actionChipText: { color: '#465047', fontSize: 11, fontWeight: '700' },
  actionChipTextSelected: { color: colors.surface },
  metricTile: {
    minHeight: 66,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  metricTileAccent: { backgroundColor: '#ECF8EE' },
  metricIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.surface,
  },
  metricText: { flex: 1 },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricValue: {
    marginTop: 2,
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  metricValueAccent: { color: colors.primary },
});
