import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { TopNotificationBar } from '@/components/TopNotificationBar';
import { useAppTheme } from '@/context/ThemeContext';
import { useTrip } from '@/context/TripContext';
import { colors } from '@/utils/theme';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { colors } = useAppTheme();
  const { selectedTravel, isLoading, error, retry } = useTrip();
  const price = selectedTravel
    ? selectedTravel.price === 0
      ? 'Free'
      : `£${selectedTravel.price}`
    : '';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.page, { backgroundColor: colors.surface }]}>
        <TopNotificationBar message="Festival updates and booking alerts" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={[styles.festivalHeader, { borderBottomColor: colors.border }]}>
            <View>
              <Text style={[styles.festivalName, { color: colors.text }]}>Greenfield Festival</Text>
              <Text style={[styles.festivalMeta, { color: colors.textMuted }]}>Travel planner</Text>
            </View>
            <View style={styles.accountBlock}>
              <Text style={[styles.date, { color: colors.text }]}>16–18 Aug</Text>
              <Text numberOfLines={1} style={[styles.accountEmail, { color: colors.textMuted }]}>{user?.email}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void signOut()}
                hitSlop={8}
                style={({ pressed }) => pressed && styles.changePressed}
              >
                <Text style={[styles.signOutText, { color: colors.primary }]}>Sign out</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.intro}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>Your festival trip</Text>
            <Text style={[styles.title, { color: colors.text }]}>How are you getting{`\n`}there?</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>Compare a few simple options before you travel.</Text>
          </View>

          <View style={[styles.detailsCard, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>TRIP DETAILS</Text>
            <DetailRow label="From" value="Manchester" />
            <DetailRow label="To" value="Willow Park" />
          </View>

          <View style={styles.planBlock}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Plan your journey</Text>
            <Text style={[styles.sectionCopy, { color: colors.textMuted }]}>See price, time, convenience and CO₂ side by side.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/travel')}
              style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>Compare travel options</Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Explore Greenfield Festival"
            onPress={() => router.push('/festival' as Href)}
            style={({ pressed }) => [
              styles.festivalCard,
              { borderColor: colors.border, backgroundColor: colors.primarySoft },
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.festivalIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="images-outline" size={21} color={colors.primary} />
            </View>
            <View style={styles.festivalCopy}>
              <Text style={[styles.festivalCardTitle, { color: colors.text }]}>Explore the festival</Text>
              <Text style={[styles.festivalCardText, { color: colors.textMuted }]}>See the story, highlights and photo gallery.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.choiceSection}>
            <Text style={[styles.choiceLabel, { color: colors.text }]}>Your choice</Text>
            <View style={[styles.choiceCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              {isLoading ? (
                <>
                  <ActivityIndicator color={colors.primary} />
                  <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading your saved choice...</Text>
                </>
              ) : selectedTravel ? (
                <>
                  <View style={[styles.iconTile, { backgroundColor: colors.surfaceMuted }]}>
                    <Ionicons name={selectedTravel.icon} size={18} color={colors.text} />
                  </View>
                  <View style={styles.choiceCopy}>
                    <Text style={[styles.choiceTitle, { color: colors.text }]}>{selectedTravel.name} selected</Text>
                    <Text style={[styles.choiceMeta, { color: colors.textMuted }]}>
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
                    <Text style={[styles.changeText, { color: colors.primary }]}>Change</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
                  <View style={styles.choiceCopy}>
                    <Text style={[styles.errorTitle, { color: colors.danger }]}>Could not load your choice</Text>
                    <Text numberOfLines={2} style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => void retry()}
                    hitSlop={10}
                    style={({ pressed }) => pressed && styles.changePressed}
                  >
                    <Text style={[styles.changeText, { color: colors.primary }]}>Retry</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>

          <Pressable accessibilityRole="link" onPress={() => router.push('/privacy' as Href)} style={({ pressed }) => [styles.privacyLink, pressed && styles.changePressed]}>
            <Ionicons name="shield-checkmark-outline" size={15} color={colors.primary} />
            <Text style={[styles.privacyText, { color: colors.primary }]}>Privacy policy</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
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
  accountBlock: { maxWidth: 165, alignItems: 'flex-end' },
  accountEmail: { maxWidth: 165, marginTop: 4, color: stylesVars.muted, fontSize: 9 },
  signOutText: { marginTop: 4, color: stylesVars.green, fontSize: 10, fontWeight: '700' },
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
  festivalCard: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 18, marginTop: 14, padding: 13, borderWidth: 1, borderRadius: 9 },
  festivalIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  festivalCopy: { flex: 1 },
  festivalCardTitle: { fontSize: 13, fontWeight: '800' },
  festivalCardText: { marginTop: 3, fontSize: 10.5, lineHeight: 14 },
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
  loadingText: { color: stylesVars.muted, fontSize: 11 },
  choiceTitle: { color: stylesVars.ink, fontSize: 13, fontWeight: '700' },
  choiceMeta: { marginTop: 4, color: stylesVars.muted, fontSize: 10.5 },
  errorTitle: { color: '#7D2F2A', fontSize: 11, fontWeight: '700' },
  errorText: { marginTop: 3, color: '#8C4D48', fontSize: 9, lineHeight: 13 },
  changeText: { color: stylesVars.green, fontSize: 12, fontWeight: '500' },
  privacyLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 },
  privacyText: { fontSize: 11.5, fontWeight: '700' },
  pressed: { opacity: 0.82 },
  changePressed: { opacity: 0.55 },
});
