import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeedbackSheet } from '@/components/FeedbackSheet';
import { cardShadow, colors, radius, spacing } from '@/utils/theme';

export default function TravelScreen() {
  const [booked, setBooked] = useState(false);
  const [feedback, setFeedback] = useState<TravelFeedback | null>(null);

  function showTravelOptions() {
    setFeedback({
      title: 'Three travel options',
      message: 'Coach is recommended for this demo. Train and festival carpool are also available from London Victoria.',
      icon: 'options-outline',
    });
  }

  function showTravelProfile() {
    setFeedback({
      title: 'Your travel impact',
      message: booked
        ? 'Your coach is booked. You saved an estimated 20.8 kg CO₂ and earned 50 Green Points.'
        : 'Book the recommended coach to save an estimated 20.8 kg CO₂ and earn 50 Green Points.',
      icon: 'person-outline',
    });
  }

  function bookCoach() {
    setBooked(true);
    setFeedback({
      title: 'Coach booked',
      message: 'Your coach is saved and 50 Green Points will be added to your festival wristband.',
      icon: 'checkmark-circle-outline',
    });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.page}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <View style={styles.brand}>
              <View style={styles.brandMark}>
                <Ionicons name="musical-notes" size={17} color={colors.surface} />
              </View>
              <Text style={styles.brandText}>Festival Travel</Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View travel options"
                onPress={showTravelOptions}
                style={({ pressed }) => [styles.headerIconButton, pressed && styles.pressed]}
              >
                <Ionicons name="options-outline" size={21} color={colors.teal} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View travel profile"
                onPress={showTravelProfile}
                style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
              >
                <Ionicons name="person-outline" size={18} color={colors.surface} />
              </Pressable>
            </View>
          </View>

          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.pageTitle}>Select Travel</Text>
              <View style={styles.routeRow}>
                <Ionicons name="navigate-outline" size={16} color={colors.primary} />
                <Text style={styles.routeText}>London Victoria</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.textMuted} />
                <Text style={styles.destinationText}>Festival Site</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Show three travel options"
              onPress={showTravelOptions}
              style={({ pressed }) => [styles.optionPill, pressed && styles.pressed]}
            >
              <Ionicons name="settings-outline" size={13} color={colors.amber} />
              <Text style={styles.optionPillText}>3 Options</Text>
            </Pressable>
          </View>

          <View style={styles.travelCard}>
            <View style={styles.cardAccent} />

            <View style={styles.badgeRow}>
              <View style={styles.recommendedBadge}>
                <Ionicons name="star" size={13} color={colors.eco} />
                <Text style={styles.recommendedText}>Recommended · Best Option</Text>
              </View>
              <View style={styles.studentBadge}>
                <Text style={styles.studentText}>STUDENT SAVER</Text>
              </View>
            </View>

            <Image
              source={require('../../assets/festival-travel-coach.jpg')}
              accessibilityLabel="Festival coach arriving at the festival entrance"
              resizeMode="cover"
              style={styles.coachImage}
            />

            <View style={styles.coachRow}>
              <View style={styles.coachIcon}>
                <Ionicons name="bus-outline" size={25} color={colors.primary} />
              </View>
              <View style={styles.coachCopy}>
                <Text style={styles.coachTitle}>Coach</Text>
                <Text style={styles.coachSubtitle}>Direct Festival Express</Text>
              </View>
              <View style={styles.priceBlock}>
                <Text style={styles.price}>€18</Text>
                <Text style={styles.returnText}>return incl.</Text>
              </View>
            </View>

            <View style={styles.metrics}>
              <Metric icon="time-outline" label="DURATION" value="1h 45m" />
              <View style={styles.metricDivider} />
              <Metric icon="leaf-outline" label="FOOTPRINT" value="3.4 kg CO₂" accent />
            </View>

            <View style={styles.carbonBox}>
              <View style={styles.carbonCopy}>
                <Text style={styles.savingText}>⌁ 86% lower carbon than solo car</Text>
                <Text style={styles.carText}>Car: 24.2 kg</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: booked }}
              disabled={booked}
              onPress={bookCoach}
              style={({ pressed }) => [
                styles.bookButton,
                booked && styles.bookButtonDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.bookButtonText}>
                {booked ? 'Coach Booked · 50 Green Pts Earned' : 'Book Coach & Earn Green Pts'}
              </Text>
              <Ionicons
                name={booked ? 'checkmark-circle-outline' : 'arrow-forward'}
                size={18}
                color={colors.surface}
              />
            </Pressable>
          </View>

          <View style={styles.perksCard}>
            <View style={styles.perksHeader}>
              <View style={styles.perksTitleRow}>
                <View style={styles.perksIcon}>
                  <Ionicons name="leaf-outline" size={18} color={colors.primary} />
                </View>
                <Text style={styles.perksTitle}>Festival Eco Travel Perks</Text>
              </View>
              <View style={styles.includedBadge}>
                <Text style={styles.includedText}>INCLUDED</Text>
              </View>
            </View>

            <PerkRow
              icon="star-outline"
              text="Instant 50 Green Points credited directly to your festival wristband"
            />
            <PerkRow
              icon="flash-outline"
              text="Priority express gate entry on arrival at Glastonbury 2025"
            />
            <PerkRow
              icon="leaf-outline"
              text="Estimated CO₂ offset: 20.8 kg compared to driving"
              strong
            />
          </View>
        </ScrollView>

        <FeedbackSheet
          visible={feedback !== null}
          title={feedback?.title ?? ''}
          message={feedback?.message ?? ''}
          icon={feedback?.icon}
          onClose={() => setFeedback(null)}
        />
      </View>
    </SafeAreaView>
  );
}

type TravelFeedback = {
  title: string;
  message: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type MetricProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent?: boolean;
};

function Metric({ icon, label, value, accent = false }: MetricProps) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricIcon}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={[styles.metricValue, accent && styles.metricValueAccent]}>{value}</Text>
      </View>
    </View>
  );
}

type PerkRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  strong?: boolean;
};

function PerkRow({ icon, text, strong = false }: PerkRowProps) {
  return (
    <View style={styles.perkRow}>
      <Ionicons name={icon} size={17} color={strong ? colors.eco : colors.teal} />
      <Text style={[styles.perkText, strong && styles.perkTextStrong]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  page: {
    width: '100%',
    maxWidth: 440,
    flex: 1,
    alignSelf: 'center',
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandMark: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.coral,
  },
  brandText: { color: colors.text, fontSize: 20, fontWeight: '800' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerIconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: colors.tealSoft,
  },
  profileButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: colors.primary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  titleBlock: { flex: 1 },
  pageTitle: { color: colors.text, fontSize: 25, fontWeight: '800' },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  routeText: { color: colors.text, fontSize: 13 },
  destinationText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.round,
    backgroundColor: colors.amberSoft,
  },
  optionPillText: { color: '#76520E', fontSize: 10, fontWeight: '700' },
  travelCard: {
    overflow: 'hidden',
    padding: spacing.lg,
    paddingTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...cardShadow,
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: colors.coral,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.round,
    backgroundColor: colors.ecoSoft,
  },
  recommendedText: { color: colors.eco, fontSize: 10, fontWeight: '700' },
  studentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.round,
    backgroundColor: colors.tealSoft,
  },
  studentText: { color: colors.teal, fontSize: 8, fontWeight: '800' },
  coachImage: {
    width: '100%',
    height: 112,
    marginTop: spacing.md,
    borderRadius: radius.md,
  },
  coachRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  coachIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  coachCopy: { flex: 1 },
  coachTitle: { color: colors.text, fontSize: 21, fontWeight: '800' },
  coachSubtitle: { marginTop: 2, color: colors.textMuted, fontSize: 12 },
  priceBlock: { alignItems: 'flex-end' },
  price: { color: colors.coral, fontSize: 30, fontWeight: '800' },
  returnText: { color: colors.text, fontSize: 9 },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    padding: 10,
    borderRadius: radius.md,
    backgroundColor: colors.tealSoft,
  },
  metric: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  metricIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.surface,
  },
  metricDivider: { width: 1, height: 28, marginHorizontal: 6, backgroundColor: '#C9DDDF' },
  metricLabel: { color: colors.textMuted, fontSize: 8, fontWeight: '800' },
  metricValue: { marginTop: 1, color: colors.text, fontSize: 13, fontWeight: '800' },
  metricValueAccent: { color: colors.eco },
  carbonBox: {
    marginTop: spacing.md,
    padding: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  carbonCopy: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  savingText: { color: colors.eco, fontSize: 9, fontWeight: '700' },
  carText: { color: colors.text, fontSize: 9 },
  progressTrack: {
    height: 7,
    overflow: 'hidden',
    marginTop: 7,
    borderRadius: radius.round,
    backgroundColor: '#D4E4D9',
  },
  progressFill: { width: '14%', height: '100%', borderRadius: radius.round, backgroundColor: colors.eco },
  bookButton: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
  },
  bookButtonDisabled: { backgroundColor: '#71947E' },
  bookButtonText: { color: colors.surface, fontSize: 14, fontWeight: '700' },
  perksCard: {
    gap: 10,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...cardShadow,
  },
  perksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: 2,
  },
  perksTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  perksIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.amberSoft,
  },
  perksTitle: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '800' },
  includedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.round,
    backgroundColor: colors.ecoSoft,
  },
  includedText: { color: colors.eco, fontSize: 8, fontWeight: '800' },
  perkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  perkText: { flex: 1, color: colors.textMuted, fontSize: 11, lineHeight: 15 },
  perkTextStrong: { color: colors.text, fontWeight: '600' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
});
