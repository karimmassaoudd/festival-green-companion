import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import type { Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopNotificationBar } from '@/components/TopNotificationBar';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import { useTrip } from '@/context/TripContext';
import { createTravelBooking } from '@/services/bookingService';
import { colors } from '@/utils/theme';

export default function BookingReviewScreen() {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ travelOptionId?: string | string[] }>();
  const travelOptionId = Array.isArray(params.travelOptionId)
    ? params.travelOptionId[0]
    : params.travelOptionId;
  const { user } = useAuth();
  const {
    travelOptions,
    selectedTravel,
    festivalId,
    isLoading,
    selectTravel,
    rememberBooking,
    showNotice,
  } = useTrip();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const travelOption = useMemo(
    () => travelOptions.find((option) => option.id === travelOptionId) ?? selectedTravel,
    [selectedTravel, travelOptionId, travelOptions],
  );
  const fullName =
    typeof user?.user_metadata.full_name === 'string'
      ? user.user_metadata.full_name
      : 'Festival traveller';

  async function confirmBooking() {
    if (!user || !festivalId || !travelOption || isConfirming) return;

    setIsConfirming(true);
    setError(null);

    try {
      const booking = await createTravelBooking({
        userId: user.id,
        festivalId,
        travelOption,
      });
      rememberBooking(travelOption.id, booking.id);
      showNotice(`${travelOption.name} booking saved in your basket`);
      await selectTravel(travelOption.id);
      router.replace(`/booking/${booking.id}` as Href);
    } catch (bookingError) {
      setError(getErrorMessage(bookingError));
      setIsConfirming(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]} edges={['top', 'bottom']}>
      <View style={[styles.page, { backgroundColor: colors.surface }]}>
        <TopNotificationBar message="Review your journey before confirming" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to travel options"
            onPress={() => router.replace('/travel' as Href)}
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={17} color={colors.textMuted} />
            <Text style={[styles.backText, { color: colors.textMuted }]}>Back</Text>
          </Pressable>

          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            {travelOption ? `${travelOption.name.toUpperCase()} BOOKING` : 'TRAVEL BOOKING'}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>Review your booking</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Check the details before confirming your festival journey.</Text>

          {isLoading || !travelOption ? (
            <View style={[styles.loadingCard, { backgroundColor: colors.surfaceMuted }]}>
              <ActivityIndicator color={colors.primary} />
              <Text style={[styles.mutedText, { color: colors.textMuted }]}>Loading booking details...</Text>
            </View>
          ) : (
            <>
              <View style={[styles.journeyCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <View style={styles.optionHeader}>
                  <View style={[styles.iconTile, { backgroundColor: colors.primarySoft }]}>
                    <Ionicons name={travelOption.icon} size={24} color={colors.primary} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={[styles.optionName, { color: colors.text }]}>
                      {travelOption.name} to Greenfield Festival
                    </Text>
                    <Text style={[styles.optionDetail, { color: colors.textMuted }]}>{travelOption.detail}</Text>
                  </View>
                  <Text style={[styles.price, { color: colors.text }]}>
                    {travelOption.price === 0 ? 'Free' : `£${travelOption.price}`}
                  </Text>
                </View>

                <View style={[styles.routeBlock, { backgroundColor: colors.surfaceMuted }]}>
                  <RouteStop icon="radio-button-on" label="From" value="Manchester" />
                  <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
                  <RouteStop icon="location" label="To" value="Willow Park" />
                </View>

                <View style={[styles.metrics, { borderTopColor: colors.border }]}>
                  <Metric label="Travel time" value={travelOption.duration} />
                  <Metric label="Convenience" value={travelOption.convenience} />
                  <Metric label="CO₂" value={`${travelOption.co2Kg} kg`} last />
                </View>
              </View>

              <View style={[styles.personCard, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
                <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>BOOKED FOR</Text>
                <Text style={[styles.personName, { color: colors.text }]}>{fullName}</Text>
                <Text style={[styles.personEmail, { color: colors.textMuted }]}>{user?.email}</Text>
              </View>

              <View style={[styles.noticeCard, { backgroundColor: colors.amberSoft }]}>
                <Ionicons name="information-circle-outline" size={21} color={colors.amber} />
                <Text style={[styles.noticeText, { color: colors.text }]}>
                  This creates reservation proof inside the app. It is not an operator ticket and does not include payment.
                </Text>
              </View>

              {error ? (
                <View style={[styles.errorCard, { backgroundColor: colors.surfaceMuted }]}>
                  <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
                  <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                disabled={isConfirming}
                onPress={() => void confirmBooking()}
                style={({ pressed }) => [
                  styles.confirmButton,
                  { backgroundColor: colors.primary },
                  isConfirming && styles.disabled,
                  pressed && styles.pressed,
                ]}
              >
                {isConfirming ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmText}>Confirm booking</Text>
                )}
              </Pressable>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function RouteStop({ icon, label, value }: { icon: 'radio-button-on' | 'location'; label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.routeRow}>
      <Ionicons name={icon} size={17} color={colors.primary} />
      <View>
        <Text style={[styles.routeLabel, { color: colors.textMuted }]}>{label}</Text>
        <Text style={[styles.routeValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

function Metric({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.metric, !last && styles.metricBorder, !last && { borderRightColor: colors.border }]}>
      <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Could not confirm the booking. Please try again.';
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
  content: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 28 },
  flex: { flex: 1 },
  backButton: { minHeight: 27, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 3 },
  backText: { color: palette.muted, fontSize: 13 },
  eyebrow: { marginTop: 23, color: palette.green, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  title: { marginTop: 7, color: palette.ink, fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.7 },
  subtitle: { marginTop: 6, color: palette.muted, fontSize: 14, lineHeight: 20 },
  loadingCard: { minHeight: 150, marginTop: 22, alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 10, backgroundColor: palette.soft },
  mutedText: { color: palette.muted, fontSize: 12 },
  journeyCard: { marginTop: 22, padding: 18, borderWidth: 1, borderColor: palette.line, borderRadius: 12, backgroundColor: '#FFFFFF' },
  optionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconTile: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: '#EAF4EE' },
  optionName: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  optionDetail: { marginTop: 4, color: palette.muted, fontSize: 11, lineHeight: 15 },
  price: { color: palette.ink, fontSize: 17, fontWeight: '800' },
  routeBlock: { marginTop: 22, padding: 14, borderRadius: 9, backgroundColor: palette.soft },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  routeLine: { width: 1, height: 20, marginVertical: 2, marginLeft: 8, backgroundColor: '#B9C7BF' },
  routeLabel: { color: palette.muted, fontSize: 9 },
  routeValue: { marginTop: 2, color: palette.ink, fontSize: 13, fontWeight: '700' },
  metrics: { flexDirection: 'row', marginTop: 17, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#EDF0F4' },
  metric: { flex: 1, minWidth: 0, paddingHorizontal: 8 },
  metricBorder: { borderRightWidth: 1, borderRightColor: '#EDF0F4' },
  metricLabel: { color: '#758299', fontSize: 9 },
  metricValue: { marginTop: 4, color: palette.ink, fontSize: 12, fontWeight: '700' },
  personCard: { marginTop: 13, padding: 16, borderWidth: 1, borderColor: palette.line, borderRadius: 10, backgroundColor: palette.soft },
  sectionLabel: { color: '#758299', fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  personName: { marginTop: 7, color: palette.ink, fontSize: 14, fontWeight: '700' },
  personEmail: { marginTop: 3, color: palette.muted, fontSize: 11 },
  noticeCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 13, padding: 13, borderRadius: 9, backgroundColor: '#FFF4DC' },
  noticeText: { flex: 1, color: '#6A511E', fontSize: 10.5, lineHeight: 16 },
  errorCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 13, padding: 12, borderRadius: 8, backgroundColor: '#FFF3F2' },
  errorText: { flex: 1, color: '#7D2F2A', fontSize: 11, lineHeight: 16 },
  confirmButton: { minHeight: 50, alignItems: 'center', justifyContent: 'center', marginTop: 18, borderRadius: 8, backgroundColor: palette.green },
  confirmText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  disabled: { opacity: 0.65 },
  pressed: { opacity: 0.72 },
});
