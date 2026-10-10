import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopNotificationBar } from '@/components/TopNotificationBar';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';

const sections = [
  {
    title: 'Information we store',
    text: 'Supabase Authentication stores your account email, encrypted password credentials and account identifier. Your profile name is stored as account metadata. The app database stores your selected festival travel option and any booking record you confirm, including its reference, status and confirmation time.',
  },
  {
    title: 'Information kept on your device',
    text: 'Your Supabase login session and light or dark theme preference are kept locally on your device so you stay signed in and the app remembers your display choice.',
  },
  {
    title: 'Why the data is used',
    text: 'The app uses this information only to sign you in, show festival travel options, save your choice, create your booking proof and restore your information when you return.',
  },
  {
    title: 'Who can access it',
    text: 'Supabase hosts the authentication and database services. Row Level Security policies restrict personal travel choices and bookings to the signed-in user. The public festival, travel and arrival-point records can be read by the app.',
  },
  {
    title: 'Payments',
    text: 'Payment processing has not been connected yet. The current app does not collect or store card numbers, bank information or payment credentials.',
  },
  {
    title: 'Your choices',
    text: 'You can sign out at any time. Before a production release, the project owner should provide a contact method for account access, correction and deletion requests, and define a data-retention period.',
  },
];

export default function PrivacyPolicyScreen() {
  const { colors } = useAppTheme();
  const { session } = useAuth();

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace((session ? '/' : '/login') as Href);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.page, { backgroundColor: colors.surface }]}>
        <TopNotificationBar message="Your account and privacy information" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <Text style={[styles.backText, { color: colors.textMuted }]}>Back</Text>
          </Pressable>

          <View style={[styles.lockTile, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="shield-checkmark-outline" size={28} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Privacy policy</Text>
          <Text style={[styles.updated, { color: colors.textMuted }]}>Last updated: 11 October 2026</Text>
          <Text style={[styles.intro, { color: colors.textMuted }]}>This page explains the current data behaviour of the Greenfield Festival Companion portfolio app in plain language.</Text>

          <View style={styles.sections}>
            {sections.map((section) => (
              <View key={section.title} style={[styles.section, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
                <Text style={[styles.sectionText, { color: colors.textMuted }]}>{section.text}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.notice, { backgroundColor: colors.amberSoft }]}>
            <Ionicons name="information-circle-outline" size={21} color={colors.amber} />
            <Text style={[styles.noticeText, { color: colors.text }]}>This is portfolio-project information, not legal advice. Review and replace it with an approved production policy before releasing a real festival service.</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  page: { width: '100%', maxWidth: 440, flex: 1, alignSelf: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 40 },
  back: { minHeight: 30, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 3 },
  backText: { fontSize: 13 },
  lockTile: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 21, borderRadius: 27 },
  title: { marginTop: 16, fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -0.7 },
  updated: { marginTop: 5, fontSize: 11 },
  intro: { marginTop: 14, fontSize: 14, lineHeight: 21 },
  sections: { gap: 11, marginTop: 24 },
  section: { padding: 15, borderWidth: 1, borderRadius: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '800' },
  sectionText: { marginTop: 7, fontSize: 12, lineHeight: 18 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 18, padding: 14, borderRadius: 10 },
  noticeText: { flex: 1, fontSize: 11, lineHeight: 17 },
  pressed: { opacity: 0.65 },
});
