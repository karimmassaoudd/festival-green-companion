import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { IconName } from '@/types/models';
import { cardShadow, colors, radius, spacing } from '@/utils/theme';

type FeedbackSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  icon?: IconName;
  primaryLabel?: string;
  onPrimary?: () => void;
  onClose: () => void;
};

export function FeedbackSheet({
  visible,
  title,
  message,
  icon = 'checkmark-circle-outline',
  primaryLabel = 'Done',
  onPrimary,
  onClose,
}: FeedbackSheetProps) {
  function handlePrimary() {
    onPrimary?.();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable accessibilityLabel="Close dialog" style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.iconCircle}>
            <Ionicons name={icon} size={30} color={colors.primary} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={handlePrimary}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(7, 35, 25, 0.48)',
  },
  sheet: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: 34,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
    ...cardShadow,
  },
  handle: {
    width: 42,
    height: 5,
    marginBottom: spacing.xl,
    borderRadius: radius.round,
    backgroundColor: colors.border,
  },
  iconCircle: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: colors.primarySoft,
  },
  title: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    maxWidth: 330,
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
  },
  primaryButtonText: { color: colors.surface, fontSize: 14, fontWeight: '800' },
  pressed: { opacity: 0.76, transform: [{ scale: 0.99 }] },
});
