import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopNotificationBar } from '@/components/TopNotificationBar';
import { useAppTheme } from '@/context/ThemeContext';

const mainStage = require('../../assets/festival/main-stage.png');
const festivalArrival = require('../../assets/festival/festival-arrival.png');

const highlights = [
  { icon: 'musical-notes-outline' as const, title: 'Three live stages', copy: 'A weekend of indie, electronic and acoustic performances.' },
  { icon: 'leaf-outline' as const, title: 'Lower-impact festival', copy: 'Solar power, refill points and reusable cup returns across the site.' },
  { icon: 'people-outline' as const, title: 'Built for community', copy: 'Accessible arrival points, local food and shared green spaces.' },
];

export default function FestivalScreen() {
  const { colors } = useAppTheme();

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/' as Href);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.page, { backgroundColor: colors.surface }]}>
        <TopNotificationBar message="Greenfield Festival stories and updates" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ImageBackground source={mainStage} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
            <View style={styles.heroShade} />
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </Pressable>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>16–18 AUG · WILLOW PARK</Text>
              <Text style={styles.heroTitle}>Greenfield{`\n`}Festival</Text>
              <Text style={styles.heroSubtitle}>Music, community and a lighter footprint.</Text>
            </View>
          </ImageBackground>

          <View style={styles.body}>
            <Text style={[styles.sectionLabel, { color: colors.primary }]}>OUR FESTIVAL</Text>
            <Text style={[styles.heading, { color: colors.text }]}>A weekend made for everyone</Text>
            <Text style={[styles.paragraph, { color: colors.textMuted }]}>Greenfield Festival is a fictional portfolio festival set in Willow Park. The experience brings music, sustainable travel and useful on-site information together in one simple companion app.</Text>

            <View style={styles.highlightList}>
              {highlights.map((item) => (
                <View key={item.title} style={[styles.highlightCard, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
                  <View style={[styles.iconTile, { backgroundColor: colors.primarySoft }]}>
                    <Ionicons name={item.icon} size={21} color={colors.primary} />
                  </View>
                  <View style={styles.highlightCopy}>
                    <Text style={[styles.highlightTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.highlightText, { color: colors.textMuted }]}>{item.copy}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { color: colors.primary }]}>THE EXPERIENCE</Text>
            <Image source={festivalArrival} resizeMode="cover" style={styles.galleryImage} />
            <Text style={[styles.imageCaption, { color: colors.textMuted }]}>Arrive by shared transport and walk into the heart of the festival.</Text>

            <View style={[styles.infoCard, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="sparkles-outline" size={22} color={colors.primary} />
              <View style={styles.infoCopy}>
                <Text style={[styles.infoTitle, { color: colors.text }]}>Created for this project</Text>
                <Text style={[styles.infoText, { color: colors.textMuted }]}>Festival details and images are original illustrative portfolio content, not a real event listing.</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/travel')}
              style={({ pressed }) => [styles.actionButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}
            >
              <Ionicons name="train-outline" size={19} color="#FFFFFF" />
              <Text style={styles.actionText}>Plan your journey</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  page: { width: '100%', maxWidth: 440, flex: 1, alignSelf: 'center' },
  content: { paddingBottom: 38 },
  hero: { height: 310, justifyContent: 'space-between' },
  heroImage: { borderBottomLeftRadius: 22, borderBottomRightRadius: 22 },
  heroShade: { ...StyleSheet.absoluteFill, borderBottomLeftRadius: 22, borderBottomRightRadius: 22, backgroundColor: 'rgba(9,25,17,0.43)' },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 14, marginLeft: 16, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.34)' },
  heroCopy: { paddingHorizontal: 22, paddingBottom: 25 },
  eyebrow: { color: '#DDF7E8', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  heroTitle: { marginTop: 8, color: '#FFFFFF', fontSize: 38, lineHeight: 40, fontWeight: '900', letterSpacing: -1 },
  heroSubtitle: { marginTop: 8, color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  body: { paddingHorizontal: 18, paddingTop: 25 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  heading: { marginTop: 8, fontSize: 25, lineHeight: 31, fontWeight: '800', letterSpacing: -0.5 },
  paragraph: { marginTop: 10, fontSize: 14, lineHeight: 21 },
  highlightList: { gap: 10, marginTop: 21, marginBottom: 28 },
  highlightCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderWidth: 1, borderRadius: 10 },
  iconTile: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21 },
  highlightCopy: { flex: 1 },
  highlightTitle: { fontSize: 13, fontWeight: '800' },
  highlightText: { marginTop: 3, fontSize: 11.5, lineHeight: 16 },
  galleryImage: { width: '100%', height: 188, marginTop: 11, borderRadius: 12 },
  imageCaption: { marginTop: 8, fontSize: 11, lineHeight: 16 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, marginTop: 22, padding: 15, borderRadius: 11 },
  infoCopy: { flex: 1 },
  infoTitle: { fontSize: 13, fontWeight: '800' },
  infoText: { marginTop: 4, fontSize: 11, lineHeight: 16 },
  actionButton: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, borderRadius: 8 },
  actionText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.78 },
});
