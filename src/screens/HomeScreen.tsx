import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { FeedbackSheet } from '@/components/FeedbackSheet';
import { ProgressRing } from '@/components/ProgressRing';
import { QuestList } from '@/components/QuestList';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { ToolCard } from '@/components/ToolCard';
import { MetricTile, Panel, SectionTitle } from '@/components/ui';
import { festivalTools, initialQuests } from '@/data/mockData';
import { EcoQuest, FestivalTool, IconName } from '@/types/models';
import { colors, radius, spacing } from '@/utils/theme';

export default function HomeScreen() {
  const [quests, setQuests] = useState<EcoQuest[]>(initialQuests);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const greenPoints = 90 + quests
    .filter((quest) => quest.completed)
    .reduce((total, quest) => total + quest.points, 0);

  function handleToolPress(tool: FestivalTool) {
    if (tool.route) {
      router.push(tool.route);
      return;
    }

    setFeedback({
      title: 'Scanner ready',
      message: 'The demo scanner is ready. Camera-based QR scanning will be connected in the GPS/API phase.',
      icon: 'qr-code-outline',
    });
  }

  function claimReward() {
    if (rewardClaimed) return;
    setRewardClaimed(true);
    setFeedback({
      title: 'Reward claimed',
      message: 'Your free zero-waste pint voucher is now stored in your Green Wallet.',
      icon: 'gift-outline',
    });
  }

  function toggleReminder() {
    const nextValue = !reminderSet;
    setReminderSet(nextValue);
    setFeedback({
      title: nextValue ? 'Reminder added' : 'Reminder removed',
      message: nextValue
        ? 'The Green Sparks Live is saved for 21:30 in this demo.'
        : 'The festival reminder has been removed.',
      icon: nextValue ? 'notifications-outline' : 'notifications-off-outline',
    });
  }

  function toggleQuest(id: string) {
    setQuests((current) =>
      current.map((quest) =>
        quest.id === id ? { ...quest, completed: !quest.completed } : quest,
      ),
    );
  }

  return (
    <ScreenScaffold
      title="Festival Home"
      onNotifications={() => setFeedback({
        title: 'Festival updates',
        message: 'Water stations are quiet and the Pyramid Stage is running on 100% stored solar power.',
        icon: 'notifications-outline',
      })}
      onProfile={() => setFeedback({
        title: 'Alex · Forest Guardian',
        message: `${greenPoints} green points collected. You are currently in the top 5% of festival visitors.`,
        icon: 'person-outline',
      })}
    >
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open Green Wallet"
          onPress={() => setFeedback({
            title: 'Green Wallet',
            message: rewardClaimed
              ? 'Your zero-waste pint voucher is ready to use.'
              : 'Complete 30 more points or claim your available voucher below.',
            icon: 'wallet-outline',
          })}
          style={({ pressed }) => [styles.walletButton, pressed && styles.pressed]}
        >
          <Ionicons name="wallet-outline" size={17} color={colors.textMuted} />
        </Pressable>
      </Panel>

      <ImageBackground
        source={require('../../assets/festival-home-hero.jpg')}
        accessibilityLabel="Festival crowd watching the main stage at sunset"
        style={styles.highlightCard}
        imageStyle={styles.highlightImage}
      >
        <LinearGradient
          colors={['rgba(12,31,22,0.08)', 'rgba(12,31,22,0.88)']}
          style={styles.highlightOverlay}
        >
          <View style={styles.highlightContent}>
            <Text style={styles.highlightEyebrow}>{"TONIGHT'S HIGHLIGHT"}</Text>
            <Text style={styles.highlightTitle}>The Green Sparks Live</Text>
            <Text style={styles.highlightSubtitle}>Solar Arch Stage · 21:30</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={toggleReminder}
            style={({ pressed }) => [
              styles.remindButton,
              reminderSet && styles.remindButtonActive,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={reminderSet ? 'checkmark-circle' : 'notifications-outline'}
              size={14}
              color={colors.surface}
            />
            <Text style={styles.remindText}>{reminderSet ? 'Added' : 'Remind'}</Text>
          </Pressable>
        </LinearGradient>
      </ImageBackground>

      <Panel>
        <View style={styles.impactHeader}>
          <View style={styles.impactCopy}>
            <Text style={styles.cardEyebrow}>PERSONAL IMPACT TIER</Text>
            <Text style={styles.impactTitle}>Forest Guardian</Text>
            <Text style={styles.impactSubtitle}>Top 5% eco-conscious festival visitor</Text>
          </View>
          <ProgressRing value={greenPoints} target={150} />
        </View>

        <View style={styles.rewardCard}>
          <Ionicons name="gift-outline" size={21} color="#8A6112" />
          <View style={styles.rewardCopy}>
            <Text style={styles.rewardTitle}>
              {rewardClaimed ? 'Voucher claimed: Free Zero-Waste Pint' : 'Voucher ready: Free Zero-Waste Pint'}
            </Text>
            <Text style={styles.rewardSubtitle}>
              {rewardClaimed ? 'Saved in your Green Wallet' : 'Claimable at Cider Barn & Green Fields'}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={rewardClaimed}
            accessibilityState={{ disabled: rewardClaimed }}
            onPress={claimReward}
            style={({ pressed }) => [
              styles.claimButton,
              rewardClaimed && styles.claimButtonDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.claimText}>{rewardClaimed ? 'Claimed' : 'Claim'}</Text>
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

      <FeedbackSheet
        visible={feedback !== null}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        icon={feedback?.icon}
        primaryLabel={feedback?.primaryLabel}
        onClose={() => setFeedback(null)}
      />
    </ScreenScaffold>
  );
}

type Feedback = {
  title: string;
  message: string;
  icon: IconName;
  primaryLabel?: string;
};

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
  rewardTitle: { color: '#493607', fontSize: 11, fontWeight: '800' },
  rewardSubtitle: { marginTop: 2, color: '#725E2D', fontSize: 9 },
  claimButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.round,
    backgroundColor: '#7A5708',
  },
  claimText: { color: colors.surface, fontSize: 10, fontWeight: '800' },
  claimButtonDisabled: { backgroundColor: colors.textMuted },
  metricRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  toolsSection: { gap: spacing.md },
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md },
  highlightCard: {
    minHeight: 164,
    overflow: 'hidden',
    borderRadius: radius.lg,
  },
  highlightImage: { borderRadius: radius.lg },
  highlightOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  highlightContent: { flex: 1 },
  highlightEyebrow: { color: '#A8DFC8', fontSize: 9, fontWeight: '800' },
  highlightTitle: { marginTop: 5, color: colors.surface, fontSize: 17, fontWeight: '700' },
  highlightSubtitle: { marginTop: 3, color: '#D4EADF', fontSize: 10 },
  remindButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
  },
  remindButtonActive: { backgroundColor: colors.primaryDark },
  remindText: { color: colors.surface, fontSize: 10, fontWeight: '800' },
  pressed: { opacity: 0.72 },
});
