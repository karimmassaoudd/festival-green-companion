import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTrip } from '@/context/TripContext';
import { TravelOption } from '@/types/models';
import { colors } from '@/utils/theme';

export default function TravelScreen() {
  const {
    travelOptions,
    selectedTravel,
    isLoading,
    isSaving,
    error,
    selectTravel,
    retry,
  } = useTrip();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.page}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            onPress={() => router.navigate('/')}
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={17} color={palette.muted} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text style={styles.title}>Choose your travel</Text>

          <View style={styles.routeCard}>
            <RouteRow label="From" value="Manchester" />
            <RouteRow label="To" value="Greenfield Festival" />
            <View style={styles.routeDivider} />
            <Text style={styles.estimate}>Estimates are for one person.</Text>
          </View>

          {isLoading ? (
            <View style={styles.statusCard}>
              <ActivityIndicator color={palette.green} />
              <Text style={styles.statusText}>Loading travel options...</Text>
            </View>
          ) : (
            <>
              {error ? (
                <View style={styles.errorCard}>
                  <Ionicons name="alert-circle-outline" size={19} color="#9B3A35" />
                  <View style={styles.errorCopy}>
                    <Text style={styles.errorTitle}>Database connection problem</Text>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => void retry()}
                    style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
                  >
                    <Text style={styles.retryText}>Retry</Text>
                  </Pressable>
                </View>
              ) : null}

              <View style={styles.options}>
                {travelOptions.map((option) => (
                  <TravelCard
                    key={option.id}
                    option={option}
                    selected={selectedTravel?.id === option.id}
                    saving={isSaving && selectedTravel?.id === option.id}
                    disabled={isSaving}
                    onSelect={() => void selectTravel(option.id)}
                  />
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function RouteRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.routeRow}>
      <Text style={styles.routeLabel}>{label}</Text>
      <Text style={styles.routeValue}>{value}</Text>
    </View>
  );
}

function TravelCard({
  option,
  selected,
  saving,
  disabled,
  onSelect,
}: {
  option: TravelOption;
  selected: boolean;
  saving: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const price = option.price === 0 ? 'Free' : `£${option.price}`;
  const buttonLabel = saving
    ? 'Saving...'
    : selected
      ? `${option.name} selected`
      : `Choose ${option.name.toLowerCase()}`;

  return (
    <View style={[styles.optionCard, selected && styles.optionCardSelected]}>
      <View style={styles.optionHeader}>
        <View style={styles.iconTile}>
          <Ionicons name={option.icon} size={18} color={palette.ink} />
        </View>
        <View style={styles.optionCopy}>
          <Text style={styles.optionName}>{option.name}</Text>
          <Text style={styles.optionDetail}>{option.detail}</Text>
          {option.sustainabilityNote ? (
            <Text style={styles.sustainabilityNote}>{option.sustainabilityNote}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.metricsRow}>
        <Metric label="Price" value={price} />
        <Metric label="Time" value={option.duration} />
        <Metric label="Convenience" value={option.convenience} />
        <Metric label="CO₂" value={`${option.co2Kg} kg`} accent={option.co2Kg === 0} last />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        disabled={disabled}
        onPress={onSelect}
        style={({ pressed }) => [
          styles.selectButton,
          selected && styles.selectButtonSelected,
          disabled && styles.selectButtonDisabled,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.selectButtonText, selected && styles.selectButtonTextSelected]}>
          {buttonLabel}
        </Text>
      </Pressable>
    </View>
  );
}

function Metric({
  label,
  value,
  accent = false,
  last = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  last?: boolean;
}) {
  return (
    <View style={[styles.metric, !last && styles.metricBorder]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text numberOfLines={1} style={[styles.metricValue, accent && styles.metricValueAccent]}>{value}</Text>
    </View>
  );
}

const palette = {
  ink: '#182033',
  muted: '#60708A',
  line: '#E2E7EE',
  soft: '#F5F7FA',
  green: '#34815F',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  page: { width: '100%', maxWidth: 440, flex: 1, alignSelf: 'center', backgroundColor: colors.surface },
  content: { paddingHorizontal: 18, paddingTop: 15, paddingBottom: 28 },
  backButton: { minHeight: 27, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 3 },
  backText: { color: '#526178', fontSize: 13 },
  title: { marginTop: 17, color: palette.ink, fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.7 },
  routeCard: {
    gap: 9,
    marginTop: 17,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    backgroundColor: palette.soft,
  },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  routeLabel: { width: 50, color: palette.muted, fontSize: 11 },
  routeValue: { color: palette.ink, fontSize: 11, fontWeight: '700' },
  routeDivider: { height: 1, marginTop: 1, backgroundColor: palette.line },
  estimate: { color: '#77849A', fontSize: 10 },
  options: { gap: 11, marginTop: 15 },
  statusCard: {
    minHeight: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    backgroundColor: palette.soft,
  },
  statusText: { color: palette.muted, fontSize: 12 },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8C5C2',
    borderRadius: 8,
    backgroundColor: '#FFF6F5',
  },
  errorCopy: { flex: 1 },
  errorTitle: { color: '#7D2F2A', fontSize: 11, fontWeight: '700' },
  errorText: { marginTop: 3, color: '#8C4D48', fontSize: 9.5, lineHeight: 14 },
  retryButton: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 5, backgroundColor: '#FFFFFF' },
  retryText: { color: '#7D2F2A', fontSize: 10, fontWeight: '700' },
  optionCard: {
    padding: 14,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  optionCardSelected: { borderWidth: 1.5, borderColor: palette.green },
  optionHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  iconTile: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#F1F4F8' },
  optionCopy: { flex: 1, paddingTop: 1 },
  optionName: { color: palette.ink, fontSize: 14, fontWeight: '700' },
  optionDetail: { marginTop: 4, color: '#536178', fontSize: 11, lineHeight: 15 },
  sustainabilityNote: { marginTop: 7, color: '#20714F', fontSize: 11, lineHeight: 15 },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 13,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EDF0F4',
  },
  metric: { flex: 1, minWidth: 0, paddingHorizontal: 7 },
  metricBorder: { borderRightWidth: 1, borderRightColor: '#EDF0F4' },
  metricLabel: { color: '#758299', fontSize: 9 },
  metricValue: { marginTop: 4, color: palette.ink, fontSize: 11, fontWeight: '700' },
  metricValueAccent: { color: palette.green },
  selectButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#D4DCE6',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  selectButtonSelected: { borderColor: palette.green, backgroundColor: palette.green },
  selectButtonDisabled: { opacity: 0.72 },
  selectButtonText: { color: '#273349', fontSize: 12 },
  selectButtonTextSelected: { color: '#FFFFFF' },
  pressed: { opacity: 0.72 },
});
