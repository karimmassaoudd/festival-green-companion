import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { ArrivalPoint } from '@/types/models';

type ArrivalMapProps = {
  points: ArrivalPoint[];
  selectedId: string;
  onSelect: (point: ArrivalPoint) => void;
};

export function ArrivalMap({ points, selectedId, onSelect }: ArrivalMapProps) {
  return (
    <View style={styles.map}>
      <Svg width="100%" height="100%" viewBox="0 0 340 315" preserveAspectRatio="none">
        <Rect x="0" y="0" width="340" height="315" fill="#F3F6FA" />
        <Path d="M-20 58 C55 72 95 56 140 74 C205 98 265 50 365 73" stroke="#CBD4E0" strokeWidth="3" fill="none" />
        <Path d="M-15 84 C65 100 102 77 150 96 C218 122 273 75 365 99" stroke="#CBD4E0" strokeWidth="3" fill="none" />
        <Path d="M83 -20 C86 35 105 75 128 118" stroke="#CBD4E0" strokeWidth="4" fill="none" />
        <Path d="M113 -20 C117 35 139 81 163 119" stroke="#CBD4E0" strokeWidth="4" fill="none" />
        <Path d="M151 210 C164 254 167 281 166 335" stroke="#CBD4E0" strokeWidth="4" fill="none" />
        <Path d="M187 210 C198 251 201 282 201 335" stroke="#CBD4E0" strokeWidth="4" fill="none" />
        <Rect x="103" y="107" width="134" height="92" rx="3" fill="#F9FCFB" stroke="#8AA9B8" strokeWidth="2" />
        <Rect x="119" y="121" width="102" height="51" rx="2" fill="#D8F5E5" />
      </Svg>

      {points.map((point) => {
        const selected = point.id === selectedId;
        return (
          <Pressable
            key={point.id}
            accessibilityRole="button"
            accessibilityLabel={`${point.name}, ${point.walkMinutes} minute walk`}
            accessibilityState={{ selected }}
            onPress={() => onSelect(point)}
            style={({ pressed }) => [
              styles.markerWrap,
              { left: `${point.x}%`, top: `${point.y}%` },
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.marker, selected && styles.markerSelected]}>
              <Ionicons name={point.icon} size={selected ? 18 : 16} color={selected ? '#FFFFFF' : '#314159'} />
            </View>
            <View style={styles.label}>
              <Text style={styles.labelText}>{point.name}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 315,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D7DEE8',
    borderRadius: 8,
    backgroundColor: '#F3F6FA',
  },
  markerWrap: {
    position: 'absolute',
    width: 108,
    alignItems: 'center',
    transform: [{ translateX: -54 }, { translateY: -23 }],
    zIndex: 2,
  },
  marker: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CCD6E3',
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
  },
  markerSelected: { borderColor: '#34815F', backgroundColor: '#34815F' },
  label: {
    maxWidth: 108,
    marginTop: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  labelText: { color: '#263247', fontSize: 11, lineHeight: 14, textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
