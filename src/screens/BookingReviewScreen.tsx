import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { useTrip } from '@/context/TripContext';
import { createTravelBooking } from '@/services/bookingService';
import { colors } from '@/utils/theme';

export default function BookingReviewScreen() {
  const { user } = useAuth();
  const {
    travelOptions,
    festivalId,
    isLoading,
    selectTravel,
    rememberBooking,
  } = useTrip();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const train = useMemo(
    () => travelOptions.find((option) => option.name === 'Train'),
    [travelOptions],
  );
  const fullName =
    typeof user?.user_metadata.full_name === 'string'
      ? user.user_metadata.full_name
      : 'Festival traveller';

  async function confirmBooking() {
    if (!user || !festivalId || !train || isConfirming) return;

    setIsConfirming(true);
    setError(null);

    try {
      const booking = await createTravelBooking({
        userId: user.id,
        festivalId,
        travelOption: train,
      });
      rememberBooking(train.id, booking.id);
      await selectTravel(train.id);
      router.replace(`/booking/${booking.id}` as Href);
    } catch (bookingError) {
      setError(getErrorMessage(bookingError));
      setIsConfirming(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to travel options"
            onPress={() => router.replace('/travel' as Href)}
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={17} color={palette.muted} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text style={styles.eyebrow}>TRAIN BOOKING</Text>
          <Text style={styles.title}>Review your booking</Text>
          <Text style={styles.subtitle}>Check the details before confirming your festival journey.</Text>

          {isLoading || !train ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={palette.green} />
              <Text style={styles.mutedText}>Loading booking details...</Text>
            </View>
          ) : (
            <>
              <View style={styles.journeyCard}>
                <View style={styles.trainHeader}>
                  <View style={styles.iconTile}>
                    <Ionicons name="train-outline" size={24} color={palette.green} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.optionName}>Train to Greenfield Festival</Text>
                    <Text style={styles.optionDetail}>{train.detail}</Text>
                  </View>
                  <Text style={styles.price}>£{train.price}</Text>
                </View>

                <View style={styles.routeBlock}>
                  <RouteStop icon="radio-button-on" label="From" value="Manchester" />
                  <View style={styles.routeLine} />
                  <RouteStop icon="location" label="To" value="Willow Park" />
                </View>

                <View style={styles.metrics}>
                  <Metric label="Travel time" value={train.duration} />
                  <Metric label="Convenience" value={train.convenience} />
                  <Metric label="CO₂" value={`${train.co2Kg} kg`} last />
                </View>
              </View>

              <View style={styles.personCard}>
                <Text style={styles.sectionLabel}>BOOKED FOR</Text>
                <Text style={styles.personName}>{fullName}</Text>
                <Text style={styles.personEmail}>{user?.email}</Text>
              </View>

              <View style={styles.noticeCard}>
                <Ionicons name="information-circle-outline" size={21} color="#765817" />
                <Text style={styles.noticeText}>
                  This creates reservation proof inside the app. It is not a rail-operator ticket and does not include payment.
                </Text>
              </View>

              {error ? (
                <View style={styles.errorCard}>
                  <Ionicons name="alert-circle-outline" size={20} color="#9B3A35" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                disabled={isConfirming}
                onPress={() => void confirmBooking()}
                style={({ pressed }) => [
                  styles.confirmButton,
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
  return (
    <View style={styles.routeRow}>
      <Ionicons name={icon} size={17} color={palette.green} />
      <View>
        <Text style={styles.routeLabel}>{label}</Text>
        <Text style={styles.routeValue}>{value}</Text>
      </View>
    </View>
  );
}

function Metric({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.metric, !last && styles.metricBorder]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
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
  trainHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
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
