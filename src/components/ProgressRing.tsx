import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/utils/theme';

type ProgressRingProps = {
  value: number;
  target: number;
  size?: number;
};

export function ProgressRing({ value, target, size = 74 }: ProgressRingProps) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / target, 1);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#DDE7DF"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - progress)}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.label}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.target}>/{target} PTS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  svg: { position: 'absolute' },
  label: { alignItems: 'center' },
  value: { color: colors.text, fontSize: 20, fontWeight: '800' },
  target: { color: colors.textMuted, fontSize: 7, fontWeight: '800' },
});
