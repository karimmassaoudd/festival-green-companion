import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopNotificationBar } from '@/components/TopNotificationBar';
import { useAppTheme } from '@/context/ThemeContext';
import { useTrip } from '@/context/TripContext';
import { TravelOption } from '@/types/models';
import { colors } from '@/utils/theme';

export default function TravelScreen() {
  const { colors } = useAppTheme();
  const {
    travelOptions,
    selectedTravel,
    bookingByTravelOptionId,
    isLoading,
    isSaving,
    error,
    retry,
  } = useTrip();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.page, { backgroundColor: colors.surface }]}>
        <TopNotificationBar message="Travel options updated for Greenfield Festival" />
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
            <Ionicons name="chevron-back" size={17} color={colors.textMuted} />
            <Text style={[styles.backText, { color: colors.textMuted }]}>Back</Text>
          </Pressable>

          <Text style={[styles.title, { color: colors.text }]}>Choose your travel</Text>

          <View style={[styles.routeCard, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
            <RouteRow label="From" value="Manchester" />
            <RouteRow label="To" value="Greenfield Festival" />
            <View style={[styles.routeDivider, { backgroundColor: colors.border }]} />
            <Text style={[styles.estimate, { color: colors.textMuted }]}>Estimates are for one person.</Text>
          </View>

          {isLoading ? (
            <View style={[styles.statusCard, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
              <ActivityIndicator color={colors.primary} />
              <Text style={[styles.statusText, { color: colors.textMuted }]}>Loading travel options...</Text>
            </View>
          ) : (
            <>
              {error ? (
                <View style={[styles.errorCard, { borderColor: colors.danger, backgroundColor: colors.surfaceMuted }]}>
                  <Ionicons name="alert-circle-outline" size={19} color={colors.danger} />
                  <View style={styles.errorCopy}>
                    <Text style={[styles.errorTitle, { color: colors.danger }]}>Database connection problem</Text>
                    <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => void retry()}
                    style={({ pressed }) => [styles.retryButton, { backgroundColor: colors.surface }, pressed && styles.pressed]}
                  >
                    <Text style={[styles.retryText, { color: colors.danger }]}>Retry</Text>
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
                    bookingId={bookingByTravelOptionId[option.id]}
                    onSelect={() => {
                      const bookingId = bookingByTravelOptionId[option.id];
                      if (bookingId) {
                        router.push(`/booking/${bookingId}` as Href);
                        return;
                      }

                      router.push({
                        pathname: '/booking/review',
                        params: { travelOptionId: option.id },
                      });
                    }}
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
  const { colors } = useAppTheme();
  return (
    <View style={styles.routeRow}>
      <Text style={[styles.routeLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.routeValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function TravelCard({
  option,
  selected,
  saving,
  disabled,
  bookingId,
  onSelect,
}: {
  option: TravelOption;
  selected: boolean;
  saving: boolean;
  disabled: boolean;
  bookingId?: string;
  onSelect: () => void;
}) {
  const { colors } = useAppTheme();
  const price = option.price === 0 ? 'Free' : `£${option.price}`;
  const buttonLabel = bookingId
    ? 'View booking proof'
    : saving
      ? 'Saving...'
      : `Book ${option.name.toLowerCase()}`;

  return (
    <View style={[
      styles.optionCard,
      { borderColor: colors.border, backgroundColor: colors.surface },
      selected && styles.optionCardSelected,
      selected && { borderColor: colors.primary },
    ]}>
      <View style={styles.optionHeader}>
        <View style={[styles.iconTile, { backgroundColor: colors.surfaceMuted }]}>
          <Ionicons name={option.icon} size={18} color={colors.text} />
        </View>
        <View style={styles.optionCopy}>
          <Text style={[styles.optionName, { color: colors.text }]}>{option.name}</Text>
          <Text style={[styles.optionDetail, { color: colors.textMuted }]}>{option.detail}</Text>
          {option.sustainabilityNote ? (
            <Text style={[styles.sustainabilityNote, { color: colors.primary }]}>{option.sustainabilityNote}</Text>
          ) : null}
        </View>
      </View>

      <View style={[styles.metricsRow, { borderColor: colors.border }]}>
        <Metric label="Price" value={price} />
        <Metric label="Time" value={option.duration} />
        <Metric label="Convenience" value={option.convenience} />
        <Metric label="CO₂" value={`${option.co2Kg} kg`} accent={option.co2Kg === 0} last />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: selected || Boolean(bookingId) }}
        disabled={disabled}
        onPress={onSelect}
        style={({ pressed }) => [
          styles.selectButton,
          { borderColor: colors.border, backgroundColor: colors.surface },
          (selected || Boolean(bookingId)) && styles.selectButtonSelected,
          (selected || Boolean(bookingId)) && { borderColor: colors.primary, backgroundColor: colors.primary },
          disabled && styles.selectButtonDisabled,
          pressed && styles.pressed,
        ]}
      >
        <Text
          style={[
            styles.selectButtonText,
            { color: colors.text },
            (selected || Boolean(bookingId)) && styles.selectButtonTextSelected,
          ]}
        >
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
  const { colors } = useAppTheme();
  return (
    <View style={[styles.metric, !last && styles.metricBorder, !last && { borderRightColor: colors.border }]}>
      <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text numberOfLines={1} style={[styles.metricValue, { color: colors.text }, accent && styles.metricValueAccent, accent && { color: colors.primary }]}>{value}</Text>
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
