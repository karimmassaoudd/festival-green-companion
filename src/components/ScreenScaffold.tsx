import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { colors, spacing } from '@/utils/theme';

type ScreenScaffoldProps = PropsWithChildren<{
  title: string;
  statusRight?: string;
  onNotifications: () => void;
  onProfile: () => void;
}>;

export function ScreenScaffold({
  title,
  statusRight = 'Live Festival Mode',
  onNotifications,
  onProfile,
  children,
}: ScreenScaffoldProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.page}>
        <AppHeader title={title} onNotifications={onNotifications} onProfile={onProfile} />
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>{statusRight}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
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
  statusRow: {
    minHeight: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  statusText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
