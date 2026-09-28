import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';

import { EcoLocation, EcoLocationType } from '@/types/models';
import { colors, radius, spacing } from '@/utils/theme';

type MockFestivalMapProps = {
  locations: EcoLocation[];
  selectedId: string;
  activeFilter: EcoLocationType | 'all';
  onSelect: (location: EcoLocation) => void;
};

const markerColors: Record<EcoLocationType, string> = {
  water: '#267A42',
  recycling: '#2E8F55',
  cup: '#B6801D',
  food: '#D96734',
};

export function MockFestivalMap({
  locations,
  selectedId,
  activeFilter,
  onSelect,
}: MockFestivalMapProps) {
  return (
    <View style={styles.map}>
      <Svg width="100%" height="100%" viewBox="0 0 350 318" preserveAspectRatio="none">
        <Rect x="0" y="0" width="350" height="318" rx="20" fill={colors.map} />
        <Path d="M-10 85 C70 58 138 92 195 70 C255 48 305 53 365 35" stroke="#E9F9EB" strokeWidth="39" fill="none" />
        <Path d="M42 330 C60 246 124 226 173 187 C219 150 257 109 316 89" stroke="#FFFFFF" strokeWidth="7" fill="none" opacity="0.9" />
        <Path d="M-15 131 C81 119 108 145 153 198 C201 255 252 260 364 238" stroke="#FFFFFF" strokeWidth="6" fill="none" opacity="0.86" />
        <Path d="M102 10 C139 77 126 112 157 168" stroke="#F4FFF5" strokeWidth="4" fill="none" opacity="0.75" />
        <Polygon points="250,36 305,67 270,112 222,84" fill="#F7FFF7" opacity="0.96" />
        <Polygon points="38,168 77,139 109,170 67,203" fill="#BFE9C4" opacity="0.82" />
        <Polygon points="285,225 332,234 326,269 276,259" fill="#F6FFF7" opacity="0.94" />
        <Circle cx="170" cy="188" r="13" fill="#FFFFFF" opacity="0.65" />
        <Path d="M170 188 C202 147 228 110 278 76" stroke="#379150" strokeWidth="3" strokeDasharray="5 5" fill="none" />
      </Svg>

      <View style={[styles.placeLabel, styles.solarLabel]}>
        <Ionicons name="sunny-outline" size={11} color={colors.amber} />
        <Text style={styles.placeText}>Solar Hub</Text>
      </View>
      <View style={[styles.placeLabel, styles.pyramidLabel]}>
        <Text style={styles.placeText}>Pyramid</Text>
      </View>
      <View style={[styles.placeLabel, styles.fieldLabel]}>
        <Text style={styles.placeText}>Healing Field</Text>
      </View>

      {locations.map((location) => {
        const selected = location.id === selectedId;
        const muted = activeFilter !== 'all' && activeFilter !== location.type;

        return (
          <Pressable
            key={location.id}
            accessibilityRole="button"
            accessibilityLabel={location.name}
            onPress={() => onSelect(location)}
            style={[
              styles.markerWrap,
              {
                left: `${location.x}%`,
                top: `${location.y}%`,
                opacity: muted ? 0.3 : 1,
              },
            ]}
          >
            {selected ? (
              <View style={styles.markerLabel}>
                <Text numberOfLines={1} style={styles.markerLabelText}>{location.name}</Text>
              </View>
            ) : null}
            <View
              style={[
                styles.marker,
                { backgroundColor: markerColors[location.type] },
                selected && styles.selectedMarker,
              ]}
            >
              <Ionicons name={location.icon} size={selected ? 17 : 14} color={colors.surface} />
            </View>
          </Pressable>
        );
      })}

      <View style={styles.youAreHere}>
        <View style={styles.youDot} />
        <Text style={styles.youText}>You · Acoustic Grove</Text>
      </View>

      <View style={styles.weather}>
        <Ionicons name="sunny-outline" size={14} color="#8B5D00" />
        <Text style={styles.weatherText}>28°C · Stay hydrated</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 318,
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.map,
  },
  markerWrap: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  marker: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    borderRadius: 16,
  },
  selectedMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    transform: [{ scale: 1.04 }],
  },
  markerLabel: {
    width: 126,
    marginBottom: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
  },
  markerLabelText: {
    color: colors.surface,
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
  placeLabel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: radius.round,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  solarLabel: { left: '9%', top: '12%' },
  pyramidLabel: { right: '10%', top: '16%' },
  fieldLabel: { left: '10%', top: '50%' },
  placeText: { color: colors.text, fontSize: 8, fontWeight: '700' },
  youAreHere: {
    position: 'absolute',
    left: '10%',
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
  },
  youDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  youText: { color: colors.text, fontSize: 8, fontWeight: '700' },
  weather: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.round,
    backgroundColor: '#F8C94E',
  },
  weatherText: { color: '#76520E', fontSize: 9, fontWeight: '800' },
});
