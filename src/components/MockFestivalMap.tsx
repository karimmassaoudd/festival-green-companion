import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
} from 'react-native-svg';

import { EcoLocation, EcoLocationType } from '@/types/models';
import { colors, radius } from '@/utils/theme';

type MockFestivalMapProps = {
  locations: EcoLocation[];
  selectedId: string;
  activeFilter: EcoLocationType | 'all';
  navigationActive?: boolean;
  onSelect: (location: EcoLocation) => void;
};

const markerColors: Record<EcoLocationType, string> = {
  water: colors.teal,
  recycling: colors.eco,
  cup: '#A87318',
  food: colors.coral,
};

export function MockFestivalMap({
  locations,
  selectedId,
  activeFilter,
  navigationActive = false,
  onSelect,
}: MockFestivalMapProps) {
  const selectedLocation = locations.find((location) => location.id === selectedId);
  const destinationX = selectedLocation ? selectedLocation.x * 3.5 : 178;
  const destinationY = selectedLocation ? selectedLocation.y * 3.5 : 205;
  const routePath = `M 80 278 C 115 258, ${Math.max(destinationX - 58, 105)} ${Math.min(destinationY + 48, 278)}, ${destinationX} ${destinationY}`;

  return (
    <View style={styles.map}>
      <Svg width="100%" height="100%" viewBox="0 0 350 350" preserveAspectRatio="none">
        <Defs>
          <SvgLinearGradient id="mapBackground" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#EAF5E8" />
            <Stop offset="1" stopColor="#CFE4D7" />
          </SvgLinearGradient>
        </Defs>

        <Rect x="0" y="0" width="350" height="350" rx="20" fill="url(#mapBackground)" />

        <Polygon points="0,0 152,0 130,91 0,105" fill="#D5EBD5" />
        <Polygon points="152,0 350,0 350,82 255,105 130,91" fill="#E4F1DF" />
        <Polygon points="0,105 130,91 181,181 80,239 0,225" fill="#C9E4CE" />
        <Polygon points="181,181 255,105 350,82 350,240 263,253" fill="#DAEBDD" />
        <Polygon points="80,239 181,181 263,253 230,350 28,350" fill="#D9EAD8" />

        <Path
          d="M-24 118 C62 102 104 113 151 169 C198 224 246 240 375 224"
          stroke="#FAFCF8"
          strokeWidth="11"
          fill="none"
        />
        <Path
          d="M37 370 C53 291 108 256 162 207 C214 159 252 116 333 81"
          stroke="#FFFFFF"
          strokeWidth="9"
          fill="none"
        />
        <Path
          d="M94 -12 C128 48 118 105 158 164"
          stroke="#F7FBF5"
          strokeWidth="6"
          fill="none"
        />
        <Path
          d="M220 350 C221 297 244 269 302 236"
          stroke="#F7FBF5"
          strokeWidth="5"
          fill="none"
        />

        <Circle cx="177" cy="181" r="19" fill="#B8D9BE" opacity="0.8" />
        <Circle cx="177" cy="181" r="9" fill="#F8FCF8" />
        <Polygon points="273,39 302,60 286,92 251,73" fill="#F9FCF7" opacity="0.95" />
        <Polygon points="34,173 71,144 107,170 67,207" fill="#B6DCBA" opacity="0.9" />
        <Polygon points="272,244 332,250 326,290 264,281" fill="#F7FBF6" opacity="0.95" />

        {navigationActive && selectedLocation ? (
          <>
            <Path
              d={routePath}
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              opacity="0.96"
            />
            <Path
              d={routePath}
              stroke={colors.coral}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="7 7"
              fill="none"
            />
            <Circle cx={destinationX} cy={destinationY} r="6" fill={colors.coral} stroke="#FFFFFF" strokeWidth="3" />
          </>
        ) : null}
      </Svg>

      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE SITE MAP</Text>
      </View>

      <View style={[styles.placeLabel, styles.mainStageLabel]}>
        <Ionicons name="musical-notes" size={11} color={colors.coral} />
        <Text style={styles.placeText}>Main Stage</Text>
      </View>
      <View style={[styles.placeLabel, styles.solarLabel]}>
        <Ionicons name="sunny-outline" size={11} color={colors.amber} />
        <Text style={styles.placeText}>Solar Field</Text>
      </View>
      <View style={[styles.placeLabel, styles.marketLabel]}>
        <Ionicons name="storefront-outline" size={10} color={colors.teal} />
        <Text style={styles.placeText}>Green Market</Text>
      </View>
      <View style={[styles.placeLabel, styles.campingLabel]}>
        <Ionicons name="bed-outline" size={10} color={colors.eco} />
        <Text style={styles.placeText}>Camping</Text>
      </View>

      {locations.map((location) => {
        const selected = location.id === selectedId;
        const muted = activeFilter !== 'all' && activeFilter !== location.type;
        const labelPosition = location.x > 72
          ? styles.markerLabelRight
          : location.x < 28
            ? styles.markerLabelLeft
            : styles.markerLabelCenter;

        return (
          <Pressable
            key={location.id}
            accessibilityRole="button"
            accessibilityLabel={`${location.name}, ${location.walkMinutes} minute walk`}
            accessibilityState={{ selected }}
            onPress={() => onSelect(location)}
            style={[
              styles.markerWrap,
              selected && styles.markerWrapSelected,
              {
                left: `${location.x}%`,
                top: `${location.y}%`,
                opacity: muted ? 0.3 : 1,
              },
            ]}
          >
            {selected ? (
              <View style={[styles.markerLabel, labelPosition]}>
                <Text numberOfLines={1} style={styles.markerLabelText}>{location.name}</Text>
                <Text style={styles.markerWalkText}>{location.walkMinutes} min</Text>
              </View>
            ) : null}

            {selected ? <View style={styles.markerPulse} /> : null}
            <View
              style={[
                styles.marker,
                { backgroundColor: markerColors[location.type] },
                selected && styles.selectedMarker,
              ]}
            >
              <Ionicons name={location.icon} size={selected ? 18 : 15} color={colors.surface} />
            </View>
          </Pressable>
        );
      })}

      <View style={styles.youAreHere}>
        <View style={styles.userPulse}>
          <View style={styles.userDot} />
        </View>
        <View>
          <Text style={styles.youLabel}>YOU ARE HERE</Text>
          <Text style={styles.youText}>Acoustic Grove</Text>
        </View>
      </View>

      {navigationActive && selectedLocation ? (
        <View style={styles.navigationBadge}>
          <Ionicons name="walk" size={13} color={colors.surface} />
          <Text style={styles.navigationText}>{selectedLocation.walkMinutes} min route</Text>
        </View>
      ) : null}

      <View style={styles.weather}>
        <Ionicons name="sunny-outline" size={14} color="#7B550A" />
        <Text style={styles.weatherText}>28°C</Text>
      </View>

      <View style={styles.compass}>
        <Ionicons name="compass-outline" size={22} color={colors.primaryDark} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 350,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#C9DDCE',
    borderRadius: radius.xl,
    backgroundColor: colors.map,
  },
  liveBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.round,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.coral },
  liveText: { color: colors.text, fontSize: 8, fontWeight: '800' },
  markerWrap: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 3,
  },
  markerWrapSelected: { zIndex: 8 },
  marker: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    borderRadius: 17,
    elevation: 3,
  },
  selectedMarker: { width: 40, height: 40, borderRadius: 20 },
  markerPulse: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: 'rgba(233,101,79,0.35)',
    borderRadius: 25,
    backgroundColor: 'rgba(233,101,79,0.10)',
  },
  markerLabel: {
    position: 'absolute',
    bottom: 47,
    width: 164,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
    paddingRight: 5,
    paddingVertical: 6,
    borderRadius: radius.round,
    backgroundColor: colors.primaryDark,
    elevation: 4,
  },
  markerLabelCenter: { left: -62 },
  markerLabelLeft: { left: -4 },
  markerLabelRight: { right: -4 },
  markerLabelText: {
    flex: 1,
    color: colors.surface,
    fontSize: 9,
    fontWeight: '800',
  },
  markerWalkText: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    overflow: 'hidden',
    borderRadius: radius.round,
    color: colors.primaryDark,
    fontSize: 8,
    fontWeight: '800',
    backgroundColor: colors.surface,
  },
  placeLabel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(33,107,69,0.10)',
    borderRadius: radius.round,
    backgroundColor: 'rgba(255,255,255,0.90)',
  },
  mainStageLabel: { left: '39%', top: '39%' },
  solarLabel: { left: '8%', top: '24%' },
  marketLabel: { right: '8%', top: '43%' },
  campingLabel: { right: '8%', bottom: '29%' },
  placeText: { color: colors.text, fontSize: 8, fontWeight: '700' },
  youAreHere: {
    position: 'absolute',
    left: 12,
    bottom: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  userPulse: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: colors.primarySoft,
  },
  userDot: {
    width: 9,
    height: 9,
    borderWidth: 2,
    borderColor: colors.surface,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  youLabel: { color: colors.textMuted, fontSize: 6, fontWeight: '800' },
  youText: { marginTop: 1, color: colors.text, fontSize: 8, fontWeight: '800' },
  navigationBadge: {
    position: 'absolute',
    right: 48,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.round,
    backgroundColor: colors.coral,
  },
  navigationText: { color: colors.surface, fontSize: 8, fontWeight: '800' },
  weather: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.round,
    backgroundColor: '#F8CF68',
  },
  weatherText: { color: '#76520E', fontSize: 9, fontWeight: '800' },
  compass: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
});
