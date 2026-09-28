import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FeedbackSheet } from '@/components/FeedbackSheet';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { TravelOptionRow } from '@/components/TravelOptionRow';
import { ActionChip, Panel, Pill, PrimaryButton, SectionTitle } from '@/components/ui';
import { travelOptions } from '@/data/mockData';
import { IconName } from '@/types/models';
import { formatPrice } from '@/utils/format';
import { colors, radius, spacing } from '@/utils/theme';

const recommendedJourney = travelOptions.find((option) => option.recommended) ?? travelOptions[0];
const maxCo2 = Math.max(...travelOptions.map((option) => option.co2Kg));
const travelDates = ['Fri 18 Aug', 'Sat 19 Aug', 'Sun 20 Aug'];
const journeyDetails: Record<string, {
  departureTime: string;
  arrivalTime: string;
  firstStop: string;
  firstDetail: string;
  secondStop: string;
  secondDetail: string;
}> = {
  train: {
    departureTime: '09:15',
    arrivalTime: '10:45',
    firstStop: 'Victoria Stn',
    firstDetail: 'Train · 58m',
    secondStop: 'E-Shuttle',
    secondDetail: 'Gate 4 · 32m',
  },
  bus: {
    departureTime: '08:30',
    arrivalTime: '10:40',
    firstStop: 'Coach Station',
    firstDetail: 'Direct coach · 2h',
    secondStop: 'West Hub',
    secondDetail: 'Walk · 10m',
  },
  carpool: {
    departureTime: '09:00',
    arrivalTime: '11:00',
    firstStop: 'Pickup Zone',
    firstDetail: 'Shared car · 1h 45m',
    secondStop: 'West Gate',
    secondDetail: 'Walk · 15m',
  },
  car: {
    departureTime: '09:15',
    arrivalTime: '11:00',
    firstStop: 'London',
    firstDetail: 'Solo drive · 1h 33m',
    secondStop: 'Car Park',
    secondDetail: 'Walk · 12m',
  },
};

export default function TravelScreen() {
  const [departure, setDeparture] = useState('London Victoria (Stn)');
  const [destination, setDestination] = useState('Festival West Hub');
  const [dateIndex, setDateIndex] = useState(0);
  const [directOnly, setDirectOnly] = useState(true);
  const [groupPass, setGroupPass] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(recommendedJourney.id);
  const [bookedOptionId, setBookedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const selectedOption = travelOptions.find((option) => option.id === selectedOptionId) ?? recommendedJourney;
  const selectedDetails = journeyDetails[selectedOption.id] ?? journeyDetails.train;
  const pointsEarned = selectedOption.recommended ? 100 : selectedOption.id === 'car' ? 10 : 60;
  const carbonSaved = Math.max(maxCo2 - selectedOption.co2Kg, 0);

  function swapRoute() {
    setDeparture(destination);
    setDestination(departure);
    setFeedback({
      title: 'Route swapped',
      message: `${destination} is now your departure point. Example prices and emissions remain unchanged.`,
      icon: 'swap-vertical',
    });
  }

  function bookJourney() {
    setBookedOptionId(selectedOption.id);
    setFeedback({
      title: 'Journey saved',
      message: `${selectedOption.name} is saved for ${travelDates[dateIndex]}. This is a demo booking and no payment was made.`,
      icon: 'ticket-outline',
    });
  }

  return (
    <ScreenScaffold
      title="Travel & Carbon"
      statusRight="Carbon-verified routes"
      onNotifications={() => setFeedback({
        title: 'Travel update',
        message: 'The 09:15 Green Express is running on time. Shuttle queue: approximately 4 minutes.',
        icon: 'notifications-outline',
      })}
      onProfile={() => setFeedback({
        title: 'Your travel impact',
        message: 'Choosing the recommended rail route saves 22.1 kg CO₂ compared with a solo car journey.',
        icon: 'leaf-outline',
      })}
    >
      <View style={styles.intro}>
        <Text style={styles.pageTitle}>Plan Low-Impact Transit</Text>
        <Text style={styles.pageSubtitle}>
          Compare travel time, price and emissions before choosing your route.
        </Text>
      </View>

      <Panel>
        <View style={styles.routeRow}>
          <View style={styles.routeIcon}>
            <Ionicons name="navigate-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.routeCopy}>
            <Text style={styles.routeLabel}>DEPARTURE</Text>
            <Text style={styles.routeValue}>{departure}</Text>
          </View>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routeRow}>
          <View style={[styles.routeIcon, styles.destinationIcon]}>
            <Ionicons name="storefront-outline" size={18} color={colors.amber} />
          </View>
          <View style={styles.routeCopy}>
            <Text style={styles.routeLabel}>DESTINATION</Text>
            <Text style={styles.routeValue}>{destination}</Text>
          </View>
          <Pressable
            accessibilityLabel="Swap departure and destination"
            onPress={swapRoute}
            style={({ pressed }) => [styles.swapButton, pressed && styles.pressed]}
          >
            <Ionicons name="swap-vertical" size={20} color={colors.surface} />
          </Pressable>
        </View>
        <View style={styles.tripTags}>
          <ActionChip
            label={travelDates[dateIndex]}
            icon="calendar-outline"
            selected
            onPress={() => setDateIndex((current) => (current + 1) % travelDates.length)}
          />
          <ActionChip
            label="Direct only"
            icon="flash-outline"
            selected={directOnly}
            onPress={() => setDirectOnly((current) => !current)}
          />
          <ActionChip
            label="Group pass"
            icon="people-outline"
            selected={groupPass}
            onPress={() => setGroupPass((current) => !current)}
          />
        </View>
      </Panel>

      <Panel>
        <View style={styles.benchmarkHeader}>
          <View>
            <Text style={styles.cardTitle}>Carbon Benchmark</Text>
            <Text style={styles.cardSubtitle}>Emissions verified per single traveller</Text>
          </View>
          <Pill label="CARBON TRUST" icon="shield-checkmark" tone="lavender" />
        </View>
        <View style={styles.optionList}>
          {travelOptions.map((option) => (
            <TravelOptionRow
              key={option.id}
              option={option}
              maxCo2={maxCo2}
              selected={option.id === selectedOptionId}
              onPress={() => setSelectedOptionId(option.id)}
            />
          ))}
        </View>
        <View style={styles.savingCard}>
          <View style={styles.savingIcon}>
            <Ionicons name="leaf" size={18} color={colors.primary} />
          </View>
          <View style={styles.savingCopy}>
            <Text style={styles.savingTitle}>{carbonSaved.toFixed(1)} kg CO₂ saved</Text>
            <Text style={styles.savingText}>
              Similar to powering an average festival cabin for 3.5 days.
            </Text>
          </View>
        </View>
      </Panel>

      <Panel style={styles.journeyCard}>
        <LinearGradient colors={['#0C6B4E', '#55B88E', '#E9A928']} style={styles.journeyAccent} />
        <View style={styles.journeyInner}>
          <View style={styles.journeyTopRow}>
            <View style={styles.journeyTags}>
              <Pill
                label={selectedOption.recommended ? 'Best Eco-Choice' : 'Selected Route'}
                icon={selectedOption.recommended ? 'leaf-outline' : 'checkmark-circle-outline'}
                tone={selectedOption.recommended ? 'green' : 'lavender'}
                compact
              />
              <Pill label={travelDates[dateIndex]} icon="calendar-outline" tone="lavender" compact />
            </View>
            <Text style={styles.price}>{formatPrice(selectedOption.price)}</Text>
          </View>

          <Text style={styles.journeyTitle}>
            {selectedOption.recommended ? 'GWR Green Express + Zero-Emission Shuttle' : selectedOption.name}
          </Text>
          <View style={styles.journeyMeta}>
            <View>
              <Text style={styles.timeStrong}>{selectedDetails.departureTime} →</Text>
              <Text style={styles.timeStrong}>{selectedDetails.arrivalTime}</Text>
            </View>
            <View style={styles.metaDivider} />
            <Text style={styles.metaText}>{selectedOption.duration}</Text>
            <View style={styles.metaDivider} />
            <Text style={styles.directText}>Direct{`\n`}Connection</Text>
          </View>

          <View style={styles.connectionCard}>
            <View style={styles.stopNumber}><Text style={styles.stopNumberText}>1</Text></View>
            <View style={styles.stopCopy}>
              <Text style={styles.stopTitle}>{selectedDetails.firstStop}</Text>
              <Text style={styles.stopDetail}>{selectedDetails.firstDetail}</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
            <View style={styles.stopNumber}><Text style={styles.stopNumberText}>2</Text></View>
            <View style={styles.stopCopy}>
              <Text style={styles.stopTitle}>{selectedDetails.secondStop}</Text>
              <Text style={styles.stopDetail}>{selectedDetails.secondDetail}</Text>
            </View>
          </View>

          <View style={styles.rewardRow}>
            <Ionicons name="ribbon" size={20} color="#A57613" />
            <Text style={styles.rewardText}>+{pointsEarned} Green Points on arrival</Text>
            <Text style={styles.syncedText}>WRISTBAND{`\n`}SYNCED</Text>
          </View>

          <PrimaryButton
            label={bookedOptionId === selectedOption.id
              ? 'Journey Saved'
              : `Save Journey & Earn ${pointsEarned} Pts`}
            icon={bookedOptionId === selectedOption.id ? 'checkmark-circle' : 'arrow-forward'}
            disabled={bookedOptionId === selectedOption.id}
            onPress={bookJourney}
          />
        </View>
      </Panel>

      <View style={styles.transportVisuals}>
        <LinearGradient colors={['#D9EFE6', '#79C1A1']} style={styles.transportVisual}>
          <Ionicons name="train-outline" size={50} color={colors.primaryDark} />
          <Text style={styles.visualTitle}>100% Electric Rail</Text>
        </LinearGradient>
        <LinearGradient colors={['#E1F0EE', '#8DBDB7']} style={styles.transportVisual}>
          <Ionicons name="bus-outline" size={50} color="#245D5A" />
          <Text style={styles.visualTitle}>Direct Solar Shuttles</Text>
        </LinearGradient>
      </View>

      <Panel>
        <SectionTitle title="Transit Hub Real-Time Map" action="LIVE STATUS" icon="git-branch-outline" />
        <View style={styles.transitMap}>
          <View style={[styles.mapLine, styles.mapLineOne]} />
          <View style={[styles.mapLine, styles.mapLineTwo]} />
          <View style={[styles.mapNode, styles.mapNodeOne]} />
          <View style={[styles.mapNode, styles.mapNodeTwo]} />
          <View style={[styles.mapNode, styles.mapNodeThree]} />
          <Text style={styles.londonLabel}>London</Text>
          <View style={styles.liveBubble}>
            <Ionicons name="locate" size={15} color={colors.primary} />
            <Text style={styles.liveBubbleText}>Live shuttle departed 4m ago</Text>
          </View>
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

const styles = StyleSheet.create({
  intro: { gap: 4 },
  pageTitle: { color: colors.text, fontSize: 23, fontWeight: '800' },
  pageSubtitle: { maxWidth: 330, color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  routeRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  routeIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
  },
  destinationIcon: { backgroundColor: colors.amberSoft },
  routeCopy: { flex: 1 },
  routeLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '800' },
  routeValue: { marginTop: 3, color: colors.text, fontSize: 16, fontWeight: '700' },
  routeLine: { width: 2, height: 10, marginLeft: 17, backgroundColor: colors.border },
  swapButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: colors.primary,
  },
  tripTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.md },
  benchmarkHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  cardSubtitle: { marginTop: 3, color: colors.textMuted, fontSize: 10 },
  optionList: { gap: spacing.lg, marginTop: spacing.lg },
  savingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  savingIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: colors.surface,
  },
  savingCopy: { flex: 1 },
  savingTitle: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  savingText: { marginTop: 2, color: colors.textMuted, fontSize: 10, lineHeight: 14 },
  journeyCard: { overflow: 'hidden', padding: 0 },
  journeyAccent: { height: 5 },
  journeyInner: { gap: spacing.md, padding: spacing.lg },
  journeyTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  journeyTags: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  price: { color: colors.primary, fontSize: 18, fontWeight: '800' },
  journeyTitle: { color: colors.text, fontSize: 19, fontWeight: '800', lineHeight: 24 },
  journeyMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  timeStrong: { color: colors.text, fontSize: 12, fontWeight: '800' },
  metaDivider: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textMuted },
  metaText: { color: colors.textMuted, fontSize: 11 },
  directText: { color: colors.primary, fontSize: 11, lineHeight: 14 },
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  stopNumber: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: colors.primary,
  },
  stopNumberText: { color: colors.surface, fontSize: 10, fontWeight: '800' },
  stopCopy: { flex: 1 },
  stopTitle: { color: colors.text, fontSize: 10, fontWeight: '700' },
  stopDetail: { color: colors.textMuted, fontSize: 8 },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.lavender,
  },
  rewardText: { flex: 1, color: colors.text, fontSize: 11, fontWeight: '700' },
  syncedText: { color: '#74530A', fontSize: 8, fontWeight: '800' },
  transportVisuals: { flexDirection: 'row', gap: spacing.sm },
  transportVisual: {
    minHeight: 110,
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  visualTitle: { color: colors.surface, fontSize: 11, fontWeight: '800' },
  transitMap: {
    height: 150,
    overflow: 'hidden',
    marginTop: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#DCEAE5',
  },
  mapLine: { position: 'absolute', height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.9)' },
  mapLineOne: { width: 250, left: -20, top: 65, transform: [{ rotate: '-12deg' }] },
  mapLineTwo: { width: 230, right: -40, top: 92, transform: [{ rotate: '18deg' }] },
  mapNode: { position: 'absolute', width: 11, height: 11, borderWidth: 3, borderColor: colors.surface, borderRadius: 6, backgroundColor: colors.primary },
  mapNodeOne: { left: 54, top: 54 },
  mapNodeTwo: { right: 86, top: 83 },
  mapNodeThree: { right: 34, bottom: 23 },
  londonLabel: { position: 'absolute', alignSelf: 'center', top: 20, color: colors.textMuted, fontSize: 12, fontWeight: '800' },
  liveBubble: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 9,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
  },
  liveBubbleText: { color: colors.text, fontSize: 10, fontWeight: '700' },
  pressed: { opacity: 0.72 },
});
