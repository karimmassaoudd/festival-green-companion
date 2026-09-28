import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EcoQuest } from '@/types/models';
import { colors, radius, spacing } from '@/utils/theme';
import { Panel, Pill, SectionTitle } from '@/components/ui';

type QuestListProps = {
  quests: EcoQuest[];
  onToggle: (id: string) => void;
};

export function QuestList({ quests, onToggle }: QuestListProps) {
  const completed = quests.filter((quest) => quest.completed).length;

  return (
    <Panel>
      <View style={styles.header}>
        <SectionTitle title="Daily Eco Quest" icon="checkmark-circle-outline" />
        <Pill label={`${completed} of ${quests.length} done`} compact />
      </View>
      <View style={styles.list}>
        {quests.map((quest) => (
          <Pressable
            key={quest.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: quest.completed }}
            onPress={() => onToggle(quest.id)}
            style={({ pressed }) => [styles.quest, pressed && styles.pressed]}
          >
            <View style={[styles.checkbox, quest.completed && styles.checkboxDone]}>
              {quest.completed ? (
                <Ionicons name="checkmark" size={16} color={colors.surface} />
              ) : null}
            </View>
            <Text style={[styles.label, quest.completed && styles.labelDone]}>{quest.label}</Text>
            <Text style={styles.points}>+{quest.points} pts</Text>
          </Pressable>
        ))}
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  list: { gap: spacing.sm, marginTop: spacing.md },
  quest: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#D8DDF8',
  },
  checkboxDone: { backgroundColor: colors.primary },
  label: { flex: 1, color: colors.text, fontSize: 12 },
  labelDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  points: { color: colors.primary, fontSize: 9, fontWeight: '800' },
  pressed: { opacity: 0.72 },
});
