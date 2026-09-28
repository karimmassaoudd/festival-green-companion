import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { TravelOption } from '@/types/models';
import { formatCo2, formatPrice } from '@/utils/format';
import { colors, radius, spacing } from '@/utils/theme';
import { Pill } from '@/components/ui';

type TravelOptionRowProps = {
  option: TravelOption;
  maxCo2: number;
};

export function TravelOptionRow({ option, maxCo2 }: TravelOptionRowProps) {
  const percentage = Math.max((option.co2Kg / maxCo2) * 100, 10);
  const barColor = option.recommended
    ? colors.primary
    : option.savingPercent === 0
      ? colors.danger
      : colors.amber;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <Ionicons name={option.icon} size={16} color={barColor} />
          <View style={styles.titleBlock}>
            <Text style={styles.name}>{option.name}</Text>
            <Text style={styles.detail}>{option.duration} · {formatPrice(option.price)}</Text>
          </View>
        </View>
        <View style={styles.valueBlock}>
          {option.recommended ? <Pill label="BEST ECO-CHOICE" compact /> : null}
          <Text style={[styles.co2, option.savingPercent === 0 && styles.co2Danger]}>
            {formatCo2(option.co2Kg)}
          </Text>
        </View>
      </View>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.bar,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.detail}>{option.detail}</Text>
        <Text style={[styles.saving, option.savingPercent === 0 && styles.baseline]}>
          {option.savingPercent > 0 ? `−${option.savingPercent}% CO₂` : 'BASELINE'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  nameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titleBlock: { flex: 1 },
  name: { color: colors.text, fontSize: 12, fontWeight: '700' },
  detail: { color: colors.textMuted, fontSize: 9, lineHeight: 13 },
  valueBlock: { alignItems: 'flex-end', gap: 3 },
  co2: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  co2Danger: { color: colors.danger },
  barTrack: {
    height: 8,
    overflow: 'hidden',
    borderRadius: radius.round,
    backgroundColor: '#E9ECE9',
  },
  bar: { height: '100%', borderRadius: radius.round },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  saving: { color: colors.primary, fontSize: 9, fontWeight: '800' },
  baseline: { color: colors.danger },
});
