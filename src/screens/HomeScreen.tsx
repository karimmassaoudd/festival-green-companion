import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressRing } from '@/components/ProgressRing';
import { QuestList } from '@/components/QuestList';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { ToolCard } from '@/components/ToolCard';
import { MetricTile, Panel, Pill, SectionTitle } from '@/components/ui';
import { festivalTools, initialQuests } from '@/data/mockData';
import { EcoQuest, FestivalTool } from '@/types/models';
import { colors, radius, spacing } from '@/utils/theme';

export default function HomeScreen() {
  const [quests, setQuests] = useState<EcoQuest[]>(initialQuests);

  function handleToolPress(tool: FestivalTool) {
    if (tool.route) {
      router.push(tool.route);
      return;
    }

    Alert.alert('Demo action', 'Cup scanning will be connected in a later step.');
  }

  function toggleQuest(id: string) {
    setQuests((current) =>
      current.map((quest) =>
        quest.id === id ? { ...quest, completed: !quest.completed } : quest,
      ),
    );
  }

  return (
    <ScreenScaffold title="Home Dashboard">
      <Panel style={styles.welcomeCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.welcomeCopy}>
          <Text style={styles.welcomeTitle}>Hey Alex! 👋</Text>
          <View style={styles.locationRow}>
            <Ionicons name="home-outline" size={12} color={colors.primary} />
            <Text style={styles.locationText}>Glastonbury 2025 · Day 2</Text>
          </View>
        </View>
        <View style={styles.walletButton}>
          <Ionicons name="wallet-outline" size={17} color={colors.textMuted} />
        </View>
      </Panel>

      <LinearGradient colors={['#328B48', '#24713A']} style={styles.festivalStatus}>
        <View style={styles.stageIcon}>
          <Ionicons name="grid-outline" size={23} color={colors.surface} />
        </View>
        <View style={styles.statusCopy}>
          <Text style={styles.statusEyebrow}>PYRAMID STAGE ENERGY · LIVE</Text>
          <Text style={styles.statusTitle}>100% Clean Solar Grid</Text>
          <Text style={styles.statusSubtitle}>Battery storage at 94% · Zero emissions</Text>
        </View>
        <Pill label="OPTIMAL" tone="white" compact />
      </LinearGradient>

      <Panel>
        <View style={styles.impactHeader}>
          <View style={styles.impactCopy}>
            <Text style={styles.cardEyebrow}>PERSONAL IMPACT TIER</Text>
            <Text style={styles.impactTitle}>Forest Guardian</Text>
            <Text style={styles.impactSubtitle}>Top 5% eco-conscious festival visitor</Text>
          </View>
          <ProgressRing value={120} target={150} />
        </View>

        <View style={styles.rewardCard}>
          <Ionicons name="gift-outline" size={21} color="#8A6112" />
          <View style={styles.rewardCopy}>
            <Text style={styles.rewardTitle}>Voucher ready: Free Zero-Waste Pint</Text>
            <Text style={styles.rewardSubtitle}>Claimable at Cider Barn & Green Fields</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert('Reward ready', 'This reward is a demo and is ready to claim.')}
            style={({ pressed }) => [styles.claimButton, pressed && styles.pressed]}
          >
            <Text style={styles.claimText}>Claim</Text>
          </Pressable>
        </View>

        <View style={styles.metricRow}>
          <MetricTile label="CO₂ offset" value="3.8 kg" icon="leaf" />
          <MetricTile label="Deposited" value="6 cups" icon="cafe" />
        </View>
      </Panel>

      <View style={styles.toolsSection}>
        <SectionTitle title="Festival Tools" action="FAST ACTIONS" />
        <View style={styles.toolGrid}>
          {festivalTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onPress={() => handleToolPress(tool)} />
          ))}
        </View>
      </View>

      <QuestList quests={quests} onToggle={toggleQuest} />

      <LinearGradient colors={['#173D2A', '#28613C', '#183524']} style={styles.highlightCard}>
        <View style={styles.highlightDecorationOne} />
        <View style={styles.highlightDecorationTwo} />
        <View style={styles.highlightContent}>
          <Text style={styles.highlightEyebrow}>{"TONIGHT'S HIGHLIGHT"}</Text>
          <Text style={styles.highlightTitle}>The Green Sparks Live</Text>
          <Text style={styles.highlightSubtitle}>Solar Arch Stage · 21:30</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => Alert.alert('Reminder set', 'We will remind you before the Green Sparks show.')}
          style={({ pressed }) => [styles.remindButton, pressed && styles.pressed]}
        >
          <Ionicons name="notifications-outline" size={14} color={colors.surface} />
          <Text style={styles.remindText}>Remind</Text>
        </Pressable>
      </LinearGradient>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
    backgroundColor: '#D8B48B',
  },
  avatarText: { color: colors.surface, fontSize: 19, fontWeight: '800' },
  onlineDot: {
    position: 'absolute',
    right: -1,
    bottom: 2,
    width: 11,
    height: 11,
    borderWidth: 2,
    borderColor: colors.surface,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  welcomeCopy: { flex: 1 },
  welcomeTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { color: colors.textMuted, fontSize: 11 },
  walletButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: colors.surfaceMuted,
  },
  festivalStatus: {
    minHeight: 98,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  stageIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  statusCopy: { flex: 1 },
  statusEyebrow: { color: '#C8F1D0', fontSize: 9, fontWeight: '700' },
  statusTitle: { marginTop: 3, color: colors.surface, fontSize: 17, fontWeight: '700' },
  statusSubtitle: { marginTop: 3, color: '#D5EADA', fontSize: 10 },
  impactHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  impactCopy: { flex: 1 },
  cardEyebrow: { color: colors.primary, fontSize: 9, fontWeight: '800' },
  impactTitle: { marginTop: 7, color: colors.text, fontSize: 20, fontWeight: '800' },
  impactSubtitle: { marginTop: 4, color: colors.textMuted, fontSize: 10 },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.amberSoft,
  },
  rewardCopy: { flex: 1 },
  rewardTitle: { color: '#4A3511', fontSize: 11, fontWeight: '800' },
  rewardSubtitle: { marginTop: 2, color: '#7A633B', fontSize: 9 },
  claimButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.round,
    backgroundColor: '#7B5818',
  },
  claimText: { color: colors.surface, fontSize: 10, fontWeight: '800' },
  metricRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  toolsSection: { gap: spacing.md },
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md },
  highlightCard: {
    minHeight: 126,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  highlightDecorationOne: {
    position: 'absolute',
    width: 170,
    height: 170,
    right: -30,
    top: -80,
    borderWidth: 22,
    borderColor: 'rgba(169,224,169,0.10)',
    borderRadius: 85,
  },
  highlightDecorationTwo: {
    position: 'absolute',
    width: 110,
    height: 110,
    left: 60,
    top: -65,
    borderWidth: 16,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 55,
  },
  highlightContent: { flex: 1 },
  highlightEyebrow: { color: '#A9DCAE', fontSize: 9, fontWeight: '800' },
  highlightTitle: { marginTop: 5, color: colors.surface, fontSize: 17, fontWeight: '700' },
  highlightSubtitle: { marginTop: 3, color: '#D7E5DA', fontSize: 10 },
  remindButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
  },
  remindText: { color: colors.surface, fontSize: 10, fontWeight: '800' },
  pressed: { opacity: 0.72 },
});
