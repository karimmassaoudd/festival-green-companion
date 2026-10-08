import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTrip } from '@/context/TripContext';
import { colors } from '@/utils/theme';

export default function HomeScreen() {
  const { selectedTravel } = useTrip();
  const price = selectedTravel.price === 0 ? 'Free' : `£${selectedTravel.price}`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.page}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.festivalHeader}>
            <View>
              <Text style={styles.festivalName}>Greenfield Festival</Text>
              <Text style={styles.festivalMeta}>Travel planner</Text>
            </View>
            <Text style={styles.date}>16–18 Aug</Text>
          </View>

          <View style={styles.intro}>
            <Text style={styles.eyebrow}>Your festival trip</Text>
            <Text style={styles.title}>How are you getting{`\n`}there?</Text>
            <Text style={styles.subtitle}>Compare a few simple options before you travel.</Text>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.cardLabel}>TRIP DETAILS</Text>
            <DetailRow label="From" value="Manchester" />
            <DetailRow label="To" value="Willow Park" />
          </View>

          <View style={styles.planBlock}>
            <Text style={styles.sectionTitle}>Plan your journey</Text>
            <Text style={styles.sectionCopy}>See price, time, convenience and CO₂ side by side.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/travel')}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>Compare travel options</Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          <View style={styles.choiceSection}>
            <Text style={styles.choiceLabel}>Your choice</Text>
            <View style={styles.choiceCard}>
              <View style={styles.iconTile}>
                <Ionicons name={selectedTravel.icon} size={18} color={stylesVars.ink} />
              </View>
              <View style={styles.choiceCopy}>
                <Text style={styles.choiceTitle}>{selectedTravel.name} selected</Text>
                <Text style={styles.choiceMeta}>
                  {price} · {selectedTravel.duration} · {selectedTravel.co2Kg} kg CO₂
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Change travel choice"
                onPress={() => router.push('/travel')}
                hitSlop={10}
                style={({ pressed }) => pressed && styles.changePressed}
              >
                <Text style={styles.changeText}>Change</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const stylesVars = {
  ink: '#182033',
  muted: '#60708A',
  line: '#E3E8EF',
  soft: '#F6F8FA',
  green: '#34815F',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  page: { width: '100%', maxWidth: 440, flex: 1, alignSelf: 'center', backgroundColor: colors.surface },
  content: { paddingBottom: 32 },
  festivalHeader: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: stylesVars.line,
  },
  festivalName: { color: stylesVars.ink, fontSize: 16, fontWeight: '700' },
  festivalMeta: { marginTop: 5, color: stylesVars.muted, fontSize: 11 },
  date: { color: '#344157', fontSize: 12 },
  intro: { paddingHorizontal: 18, paddingTop: 23 },
  eyebrow: { color: stylesVars.green, fontSize: 12, fontWeight: '700' },
  title: { marginTop: 7, color: stylesVars.ink, fontSize: 28, lineHeight: 31, fontWeight: '800', letterSpacing: -0.7 },
  subtitle: { marginTop: 9, color: '#4D5D75', fontSize: 14, lineHeight: 20 },
  detailsCard: {
    gap: 10,
    marginHorizontal: 18,
    marginTop: 21,
    padding: 15,
    borderWidth: 1,
    borderColor: stylesVars.line,
    borderRadius: 8,
    backgroundColor: stylesVars.soft,
  },
  cardLabel: { marginBottom: 1, color: '#66758C', fontSize: 10, fontWeight: '700' },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailLabel: { width: 58, color: stylesVars.muted, fontSize: 12 },
  detailValue: { color: stylesVars.ink, fontSize: 12, fontWeight: '700' },
  planBlock: { paddingHorizontal: 18, paddingTop: 23 },
  sectionTitle: { color: stylesVars.ink, fontSize: 15, fontWeight: '700' },
  sectionCopy: { marginTop: 8, color: '#4D5D75', fontSize: 12, lineHeight: 17 },
  primaryButton: {
    minHeight: 47,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    borderRadius: 7,
    backgroundColor: stylesVars.green,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  divider: { height: 1, marginHorizontal: 18, marginTop: 23, backgroundColor: stylesVars.line },
  choiceSection: { paddingHorizontal: 18, paddingTop: 22 },
  choiceLabel: { color: stylesVars.ink, fontSize: 11, fontWeight: '700' },
  choiceCard: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: stylesVars.line,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  iconTile: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#F1F4F8' },
  choiceCopy: { flex: 1 },
  choiceTitle: { color: stylesVars.ink, fontSize: 13, fontWeight: '700' },
  choiceMeta: { marginTop: 4, color: stylesVars.muted, fontSize: 10.5 },
  changeText: { color: stylesVars.green, fontSize: 12, fontWeight: '500' },
  pressed: { opacity: 0.82 },
  changePressed: { opacity: 0.55 },
});
