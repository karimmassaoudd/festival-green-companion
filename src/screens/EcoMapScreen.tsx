import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArrivalMap } from '@/components/ArrivalMap';
import { arrivalPoints } from '@/data/mockData';
import { colors } from '@/utils/theme';

export default function EcoMapScreen() {
  const [selectedId, setSelectedId] = useState('main');
  const selected = useMemo(
    () => arrivalPoints.find((point) => point.id === selectedId) ?? arrivalPoints[2],
    [selectedId],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.page}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            onPress={() => router.navigate('/')}
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={17} color={palette.muted} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text style={styles.title}>Find your arrival point</Text>
          <Text style={styles.subtitle}>Tap a labelled pin to check the walk to the entrance.</Text>

          <View style={styles.mapWrap}>
            <ArrivalMap points={arrivalPoints} selectedId={selectedId} onSelect={(point) => setSelectedId(point.id)} />
          </View>

          <View style={styles.selectedCard}>
            <Text style={styles.cardLabel}>SELECTED LOCATION</Text>
            <View style={styles.selectedRow}>
              <View style={styles.iconTile}>
                <Ionicons name={selected.icon} size={19} color={palette.green} />
              </View>
              <View style={styles.selectedCopy}>
                <Text style={styles.selectedName}>{selected.name}</Text>
                <Text style={styles.selectedMeta}>
                  Walking time: {selected.walkMinutes} minute{selected.walkMinutes === 1 ? '' : 's'} to the main arena
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const palette = {
  ink: '#182033',
  muted: '#60708A',
  line: '#E2E7EE',
  soft: '#F6F8FA',
  green: '#34815F',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  page: { width: '100%', maxWidth: 440, flex: 1, alignSelf: 'center', backgroundColor: colors.surface },
  content: { paddingHorizontal: 18, paddingTop: 15, paddingBottom: 28 },
  backButton: { minHeight: 27, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 3 },
  backText: { color: '#526178', fontSize: 13 },
  title: { marginTop: 17, color: palette.ink, fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.7 },
  subtitle: { maxWidth: 300, marginTop: 7, color: '#4D5D75', fontSize: 14, lineHeight: 20 },
  mapWrap: { marginTop: 18 },
  selectedCard: {
    marginTop: 13,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderLeftWidth: 3,
    borderLeftColor: palette.green,
    borderRadius: 7,
    backgroundColor: palette.soft,
  },
  cardLabel: { color: '#758299', fontSize: 9, fontWeight: '700' },
  selectedRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 9 },
  iconTile: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 6, backgroundColor: '#FFFFFF' },
  selectedCopy: { flex: 1 },
  selectedName: { color: palette.ink, fontSize: 13, fontWeight: '700' },
  selectedMeta: { marginTop: 4, color: palette.muted, fontSize: 10.5, lineHeight: 15 },
  pressed: { opacity: 0.65 },
});
