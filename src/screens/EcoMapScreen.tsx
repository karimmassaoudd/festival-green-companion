import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { MockFestivalMap } from '@/components/MockFestivalMap';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { Panel, Pill, PrimaryButton } from '@/components/ui';
import { ecoFilterLabels, ecoLocations } from '@/data/mockData';
import { EcoLocation, EcoLocationType } from '@/types/models';
import { formatDistance } from '@/utils/format';
import { colors, radius, spacing } from '@/utils/theme';

type Filter = EcoLocationType | 'all';

export default function EcoMapScreen() {
  const [selectedId, setSelectedId] = useState(ecoLocations[0].id);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const selected = useMemo(
    () => ecoLocations.find((location) => location.id === selectedId) ?? ecoLocations[0],
    [selectedId],
  );

  function selectFilter(filter: Filter) {
    setActiveFilter(filter);
    if (filter !== 'all') {
      const firstMatch = ecoLocations.find((location) => location.type === filter);
      if (firstMatch) setSelectedId(firstMatch.id);
    }
  }

  function selectLocation(location: EcoLocation) {
    setSelectedId(location.id);
    setActiveFilter(location.type);
  }

  return (
    <ScreenScaffold title="Festival Eco Map" statusRight="GPS ±1.8m RTK · Demo">
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={19} color={colors.primary} />
          <TextInput
            accessibilityLabel="Search eco map"
            placeholder="Find water, recycling, solar hubs..."
            placeholderTextColor="#818A82"
            style={styles.searchInput}
          />
          <View style={styles.filterIcon}>
            <Ionicons name="options-outline" size={18} color={colors.text} />
          </View>
        </View>
      </View>

      <View style={styles.quickChips}>
        <Pill label="Chilled Water (Free)" icon="water" tone="white" />
        <Pill label="Smart Cup Return (+10 pts)" icon="sync" tone="white" />
      </View>

      <View style={styles.filterRow}>
        <FilterChip label="All" active={activeFilter === 'all'} onPress={() => selectFilter('all')} />
        {(Object.keys(ecoFilterLabels) as EcoLocationType[]).map((filter) => (
          <FilterChip
            key={filter}
            label={ecoFilterLabels[filter]}
            active={activeFilter === filter}
            onPress={() => selectFilter(filter)}
          />
        ))}
      </View>

      <MockFestivalMap
        locations={ecoLocations}
        selectedId={selectedId}
        activeFilter={activeFilter}
        onSelect={selectLocation}
      />

      <Panel>
        <View style={styles.locationHeader}>
          <View style={styles.locationTitleBlock}>
            <Text style={styles.locationTitle}>{selected.name}</Text>
            <View style={styles.locationDetailRow}>
              <Ionicons name={selected.icon} size={13} color={colors.primary} />
              <Text style={styles.locationDetail}>{selected.detail}</Text>
            </View>
          </View>
          <Pill label="CERTIFIED CLEAN" compact />
        </View>

        <View style={styles.mapMetrics}>
          <MapMetric label="Distance" value={formatDistance(selected.distanceMeters)} />
          <MapMetric label="Walk" value={`${selected.walkMinutes} min`} />
          <MapMetric label="Status" value={selected.type === 'water' ? '4 open' : 'Open'} accent />
          <MapMetric label="Queue" value={`${selected.waitMinutes} min`} accent />
        </View>

        <View style={styles.impactBanner}>
          <View style={styles.impactIcon}>
            <Ionicons name="trash-bin" size={18} color={colors.surface} />
          </View>
          <View style={styles.impactCopy}>
            <Text style={styles.impactTitle}>3,420 single-use bottles saved</Text>
            <Text style={styles.impactText}>Prevented on site today</Text>
          </View>
          <Pill label="LIVE" tone="white" compact />
        </View>

        <View style={styles.buttonStack}>
          <PrimaryButton
            label="Start Walking Navigation"
            icon="navigate-circle-outline"
            onPress={() => Alert.alert('Demo navigation', `Walking directions to ${selected.name} will use GPS later.`)}
          />
          <PrimaryButton
            label={selected.type === 'water' ? 'Log 750ml Refill (+10 Pts)' : 'Log Sustainable Action (+10 Pts)'}
            icon="add-circle"
            variant="soft"
            onPress={() => Alert.alert('Action logged', '10 example green points were added for this demo.')}
          />
        </View>
      </Panel>
    </ScreenScaffold>
  );
}

type FilterChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterChip,
        active && styles.filterChipActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

type MapMetricProps = {
  label: string;
  value: string;
  accent?: boolean;
};

function MapMetric({ label, value, accent = false }: MapMetricProps) {
  return (
    <View style={styles.mapMetric}>
      <Text style={styles.mapMetricLabel}>{label}</Text>
      <Text style={[styles.mapMetricValue, accent && styles.mapMetricValueAccent]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', alignItems: 'center' },
  searchBox: {
    minHeight: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: 5,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 12 },
  filterIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
  },
  quickChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
  },
  filterChipActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  filterChipText: { color: colors.textMuted, fontSize: 9, fontWeight: '700' },
  filterChipTextActive: { color: colors.surface },
  locationHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  locationTitleBlock: { flex: 1 },
  locationTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  locationDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationDetail: { flex: 1, color: colors.textMuted, fontSize: 10 },
  mapMetrics: { flexDirection: 'row', gap: 6, marginTop: spacing.lg },
  mapMetric: {
    minHeight: 62,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  mapMetricLabel: { color: colors.textMuted, fontSize: 8, fontWeight: '800', textTransform: 'uppercase' },
  mapMetricValue: { marginTop: 5, color: colors.text, fontSize: 15, fontWeight: '800' },
  mapMetricValueAccent: { color: colors.primary },
  impactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#E4F2E6',
  },
  impactIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  impactCopy: { flex: 1 },
  impactTitle: { color: colors.text, fontSize: 11, fontWeight: '800' },
  impactText: { marginTop: 2, color: colors.textMuted, fontSize: 9 },
  buttonStack: { gap: spacing.sm, marginTop: spacing.md },
  pressed: { opacity: 0.72 },
});
