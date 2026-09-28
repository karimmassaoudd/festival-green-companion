import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FeedbackSheet } from '@/components/FeedbackSheet';
import { MockFestivalMap } from '@/components/MockFestivalMap';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { ActionChip, Panel, Pill, PrimaryButton } from '@/components/ui';
import { ecoFilterLabels, ecoLocations } from '@/data/mockData';
import { EcoLocation, EcoLocationType, IconName } from '@/types/models';
import { formatDistance } from '@/utils/format';
import { colors, radius, spacing } from '@/utils/theme';

type Filter = EcoLocationType | 'all';

export default function EcoMapScreen() {
  const [selectedId, setSelectedId] = useState(ecoLocations[0].id);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [navigationActive, setNavigationActive] = useState(false);
  const [loggedLocations, setLoggedLocations] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const selected = useMemo(
    () => ecoLocations.find((location) => location.id === selectedId) ?? ecoLocations[0],
    [selectedId],
  );

  const visibleLocations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ecoLocations.filter((location) => {
      const matchesFilter = activeFilter === 'all' || location.type === activeFilter;
      const matchesQuery = normalizedQuery.length === 0
        || location.name.toLowerCase().includes(normalizedQuery)
        || location.detail.toLowerCase().includes(normalizedQuery)
        || ecoFilterLabels[location.type].toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  function selectFilter(filter: Filter) {
    setActiveFilter(filter);
    setNavigationActive(false);
    if (filter !== 'all') {
      const firstMatch = ecoLocations.find((location) => location.type === filter);
      if (firstMatch) setSelectedId(firstMatch.id);
    }
  }

  function selectLocation(location: EcoLocation) {
    setSelectedId(location.id);
    setActiveFilter(location.type);
  }

  function updateQuery(value: string) {
    setQuery(value);
    const normalized = value.trim().toLowerCase();
    if (!normalized) return;
    const firstMatch = ecoLocations.find((location) =>
      location.name.toLowerCase().includes(normalized)
      || location.detail.toLowerCase().includes(normalized),
    );
    if (firstMatch) {
      setSelectedId(firstMatch.id);
      setActiveFilter('all');
    }
  }

  function toggleNavigation() {
    const nextValue = !navigationActive;
    setNavigationActive(nextValue);
    setFeedback({
      title: nextValue ? 'Walking route started' : 'Walking route stopped',
      message: nextValue
        ? `${selected.name} is ${formatDistance(selected.distanceMeters)} away, about ${selected.walkMinutes} minute${selected.walkMinutes === 1 ? '' : 's'} on foot.`
        : 'The demo walking route has been cleared.',
      icon: nextValue ? 'navigate-circle-outline' : 'stop-circle-outline',
    });
  }

  function logAction() {
    if (loggedLocations.has(selected.id)) return;
    setLoggedLocations((current) => new Set(current).add(selected.id));
    setFeedback({
      title: 'Green action logged',
      message: `10 example points were added for visiting ${selected.name}.`,
      icon: 'checkmark-circle-outline',
    });
  }

  return (
    <ScreenScaffold
      title="Festival Eco Map"
      statusRight="GPS ±1.8m RTK · Demo"
      onNotifications={() => setFeedback({
        title: 'Map update',
        message: 'West Stage water has no queue. Central Cup Return currently has a 4-minute wait.',
        icon: 'notifications-outline',
      })}
      onProfile={() => setFeedback({
        title: 'Your map activity',
        message: `${loggedLocations.size} sustainable map action${loggedLocations.size === 1 ? '' : 's'} logged in this session.`,
        icon: 'person-outline',
      })}
    >
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={19} color={colors.primary} />
          <TextInput
            accessibilityLabel="Search eco map"
            placeholder="Find water, recycling, solar hubs..."
            placeholderTextColor="#818A82"
            value={query}
            onChangeText={updateQuery}
            returnKeyType="search"
            style={styles.searchInput}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={query ? 'Clear search' : 'Toggle map filters'}
            accessibilityState={{ expanded: query ? undefined : filtersOpen }}
            onPress={() => query ? updateQuery('') : setFiltersOpen((current) => !current)}
            style={({ pressed }) => [styles.filterIcon, pressed && styles.pressed]}
          >
            <Ionicons name={query ? 'close' : 'options-outline'} size={18} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.quickChips}>
        <ActionChip
          label="Chilled Water (Free)"
          icon="water"
          selected={activeFilter === 'water'}
          onPress={() => selectFilter('water')}
        />
        <ActionChip
          label="Smart Cup Return (+10 pts)"
          icon="sync"
          selected={activeFilter === 'cup'}
          onPress={() => selectFilter('cup')}
        />
      </View>

      {filtersOpen ? (
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
      ) : null}

      {visibleLocations.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={24} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No eco locations found</Text>
          <Text style={styles.emptyText}>Try a different search or select All.</Text>
        </View>
      ) : null}

      <MockFestivalMap
        locations={visibleLocations}
        selectedId={selectedId}
        activeFilter={activeFilter}
        navigationActive={navigationActive}
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
            label={navigationActive ? 'Stop Walking Navigation' : 'Start Walking Navigation'}
            icon={navigationActive ? 'stop-circle-outline' : 'navigate-circle-outline'}
            onPress={toggleNavigation}
          />
          <PrimaryButton
            label={loggedLocations.has(selected.id)
              ? 'Action Logged (+10 Pts)'
              : selected.type === 'water'
                ? 'Log 750ml Refill (+10 Pts)'
                : 'Log Sustainable Action (+10 Pts)'}
            icon={loggedLocations.has(selected.id) ? 'checkmark-circle' : 'add-circle'}
            variant="soft"
            disabled={loggedLocations.has(selected.id)}
            onPress={logAction}
          />
        </View>
      </Panel>

      <FeedbackSheet
        visible={feedback !== null}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        icon={feedback?.icon}
        onClose={() => setFeedback(null)}
      />
    </ScreenScaffold>
  );
}

type Feedback = {
  title: string;
  message: string;
  icon: IconName;
};

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
  emptyState: {
    alignItems: 'center',
    gap: 4,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  emptyTitle: { color: colors.text, fontSize: 13, fontWeight: '800' },
  emptyText: { color: colors.textMuted, fontSize: 10 },
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
