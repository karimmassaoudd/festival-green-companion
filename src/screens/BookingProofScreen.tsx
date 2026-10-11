import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import type { Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopNotificationBar } from '@/components/TopNotificationBar';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import { loadBookingProof, TravelBookingProof } from '@/services/bookingService';
import { colors } from '@/utils/theme';

export default function BookingProofScreen() {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ bookingId: string | string[] }>();
  const bookingId = Array.isArray(params.bookingId) ? params.bookingId[0] : params.bookingId;
  const { user } = useAuth();
  const [proof, setProof] = useState<TravelBookingProof | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fullName =
    typeof user?.user_metadata.full_name === 'string'
      ? user.user_metadata.full_name
      : 'Festival traveller';

  const loadProof = useCallback(async () => {
    if (!bookingId || !user) return;
    setIsLoading(true);
    setError(null);

    try {
      setProof(await loadBookingProof(bookingId, user.id));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, user]);

  useEffect(() => {
    const startupTimer = setTimeout(() => void loadProof(), 0);
    return () => clearTimeout(startupTimer);
  }, [loadProof]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]} edges={['top', 'bottom']}>
      <View style={[styles.page, { backgroundColor: colors.surface }]}>
        <TopNotificationBar message="Your confirmed booking is saved" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to travel options"
            onPress={() => router.replace('/travel' as Href)}
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={17} color={colors.textMuted} />
            <Text style={[styles.backText, { color: colors.textMuted }]}>Travel options</Text>
          </Pressable>

          {isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={colors.primary} size="large" />
              <Text style={[styles.mutedText, { color: colors.textMuted }]}>Loading your booking proof...</Text>
            </View>
          ) : error || !proof ? (
            <View style={styles.errorState}>
              <Ionicons name="alert-circle-outline" size={30} color={colors.danger} />
              <Text style={[styles.errorTitle, { color: colors.text }]}>Could not load booking proof</Text>
              <Text style={[styles.errorText, { color: colors.textMuted }]}>{error ?? 'This booking was not found.'}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void loadProof()}
                style={({ pressed }) => [styles.retryButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={[styles.successIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={33} color="#FFFFFF" />
              </View>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>BOOKING CONFIRMED</Text>
              <Text style={[styles.title, { color: colors.text }]}>Your {proof.travelOptionName} is booked</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>This proof was loaded from your Supabase booking record.</Text>

              <View style={[styles.proofCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <View style={styles.referenceHeader}>
                  <View>
                    <Text style={[styles.smallLabel, { color: colors.textMuted }]}>BOOKING REFERENCE</Text>
                    <Text selectable style={[styles.reference, { color: colors.text }]}>{proof.bookingReference}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: colors.primarySoft }]}>
                    <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.statusText, { color: colors.primary }]}>{proof.status.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={[styles.dashedLine, { borderColor: colors.border }]} />

                <View style={styles.festivalRow}>
                  <View style={[styles.travelIcon, { backgroundColor: colors.primarySoft }]}>
                    <Ionicons name={getTravelIcon(proof.travelOptionName)} size={24} color={colors.primary} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={[styles.travelName, { color: colors.text }]}>{proof.travelOptionName}</Text>
                    <Text style={[styles.festivalName, { color: colors.textMuted }]}>{proof.festivalName}</Text>
                  </View>
                  <Text style={[styles.price, { color: colors.text }]}>{proof.price === 0 ? 'Free' : `£${proof.price}`}</Text>
                </View>

                <View style={[styles.routeBox, { backgroundColor: colors.surfaceMuted }]}>
                  <ProofRow label="From" value={proof.originName} />
                  <ProofRow label="To" value={proof.destinationName} />
                  <ProofRow label="Travel time" value={proof.duration} />
                  <ProofRow label="Festival dates" value={formatDateRange(proof.festivalStartDate, proof.festivalEndDate)} />
                  <ProofRow label="CO₂ estimate" value={`${proof.co2Kg} kg`} />
                </View>

                <View style={[styles.personSection, { borderTopColor: colors.border }]}>
                  <Text style={[styles.smallLabel, { color: colors.textMuted }]}>BOOKED FOR</Text>
                  <Text style={[styles.personName, { color: colors.text }]}>{fullName}</Text>
                  <Text style={[styles.personEmail, { color: colors.textMuted }]}>{user?.email}</Text>
                </View>

                <View style={styles.bookedAtRow}>
                  <Ionicons name="time-outline" size={15} color={colors.textMuted} />
                  <Text style={[styles.bookedAt, { color: colors.textMuted }]}>Confirmed {formatDateTime(proof.bookedAt)}</Text>
                </View>
              </View>

              <View style={[styles.noticeCard, { backgroundColor: colors.primarySoft }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
                <Text style={[styles.noticeText, { color: colors.text }]}>
                  In-app reservation proof only. This is not an operator ticket and cannot be used for travel.
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => router.replace('/travel' as Href)}
                style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}
              >
                <Text style={styles.primaryButtonText}>Back to travel</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function ProofRow({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.proofRow}>
      <Text style={[styles.proofLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.proofValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function getTravelIcon(name: string): 'train-outline' | 'bus-outline' | 'car-outline' | 'bicycle-outline' {
  const icons = {
    Train: 'train-outline',
    Bus: 'bus-outline',
    Car: 'car-outline',
    Bike: 'bicycle-outline',
  } as const;

  return icons[name as keyof typeof icons] ?? 'train-outline';
}

function formatDateRange(start: string, end: string) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const month = endDate.toLocaleDateString('en-GB', { month: 'short' });
  return `${startDate.getDate()}–${endDate.getDate()} ${month} ${endDate.getFullYear()}`;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Could not load booking proof.';
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
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 15, paddingBottom: 28 },
  flex: { flex: 1 },
  backButton: { minHeight: 27, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 3 },
  backText: { color: palette.muted, fontSize: 13 },
  loadingState: { flex: 1, minHeight: 460, alignItems: 'center', justifyContent: 'center', gap: 12 },
  mutedText: { color: palette.muted, fontSize: 12 },
  errorState: { minHeight: 360, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  errorTitle: { marginTop: 12, color: palette.ink, fontSize: 17, fontWeight: '800' },
  errorText: { marginTop: 7, color: palette.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  retryButton: { marginTop: 18, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 7, backgroundColor: palette.green },
  retryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  successIcon: { width: 62, height: 62, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 28, borderRadius: 31, backgroundColor: palette.green },
  eyebrow: { marginTop: 18, color: palette.green, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textAlign: 'center' },
  title: { marginTop: 6, color: palette.ink, fontSize: 27, lineHeight: 33, fontWeight: '800', letterSpacing: -0.6, textAlign: 'center' },
  subtitle: { marginTop: 6, color: palette.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  proofCard: { marginTop: 22, padding: 18, borderWidth: 1, borderColor: palette.line, borderRadius: 12, backgroundColor: '#FFFFFF' },
  referenceHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  smallLabel: { color: '#758299', fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  reference: { marginTop: 5, color: palette.ink, fontSize: 20, fontWeight: '800', letterSpacing: 1.1 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 20, backgroundColor: '#E8F3ED' },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.green },
  statusText: { color: palette.green, fontSize: 9, fontWeight: '800' },
  dashedLine: { marginVertical: 18, borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#C9D1DA' },
  festivalRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  travelIcon: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: '#EAF4EE' },
  travelName: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  festivalName: { marginTop: 3, color: palette.muted, fontSize: 11 },
  price: { color: palette.ink, fontSize: 17, fontWeight: '800' },
  routeBox: { gap: 11, marginTop: 18, padding: 14, borderRadius: 9, backgroundColor: palette.soft },
  proofRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  proofLabel: { color: palette.muted, fontSize: 10 },
  proofValue: { flexShrink: 1, color: palette.ink, fontSize: 11, fontWeight: '700', textAlign: 'right' },
  personSection: { marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#EDF0F4' },
  personName: { marginTop: 7, color: palette.ink, fontSize: 13, fontWeight: '700' },
  personEmail: { marginTop: 3, color: palette.muted, fontSize: 10 },
  bookedAtRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  bookedAt: { color: palette.muted, fontSize: 10 },
  noticeCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 13, padding: 13, borderRadius: 9, backgroundColor: '#EAF4EE' },
  noticeText: { flex: 1, color: '#245B43', fontSize: 10.5, lineHeight: 16 },
  primaryButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 18, borderRadius: 8, backgroundColor: palette.green },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.72 },
});
