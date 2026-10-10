import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type TopNotificationBarProps = {
  message?: string;
};

export function TopNotificationBar({
  message = 'Travel updates and booking alerts appear here',
}: TopNotificationBarProps) {
  const { colors, isDark, toggleTheme } = useAppTheme();

  return (
    <View
      accessibilityRole="summary"
      style={[styles.bar, { backgroundColor: colors.primarySoft, borderBottomColor: colors.border }]}
    >
      <View style={[styles.bell, { backgroundColor: colors.surface }]}>
        <Ionicons name="notifications-outline" size={17} color={colors.primary} />
        <View style={[styles.dot, { backgroundColor: colors.coral, borderColor: colors.surface }]} />
      </View>
      <Text numberOfLines={1} style={[styles.message, { color: colors.text }]}>
        {message}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        onPress={toggleTheme}
        hitSlop={8}
        style={({ pressed }) => [
          styles.themeButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={18} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bell: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  dot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 6,
    height: 6,
    borderWidth: 1,
    borderRadius: 3,
  },
  message: { flex: 1, fontSize: 10.5, fontWeight: '600' },
  themeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 16,
  },
  pressed: { opacity: 0.65 },
});
