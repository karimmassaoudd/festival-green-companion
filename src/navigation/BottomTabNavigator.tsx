import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { ColorValue, StyleSheet, View } from 'react-native';

import { IconName } from '@/types/models';
import { useAppTheme } from '@/context/ThemeContext';

export default function BottomTabNavigator() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          marginTop: 3,
          fontSize: 12,
          fontWeight: '400',
        },
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} activeColor={colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="travel"
        options={{
          title: 'Travel',
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'bus' : 'bus-outline'} color={color} focused={focused} activeColor={colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'map' : 'map-outline'} color={color} focused={focused} activeColor={colors.primary} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color, focused, activeColor }: { name: IconName; color: ColorValue; focused: boolean; activeColor: string }) {
  return (
    <View style={styles.iconWrap}>
      {focused ? <View style={[styles.activeLine, { backgroundColor: activeColor }]} /> : null}
      <Ionicons name={name} color={color} size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: { width: 100, alignItems: 'center' },
  activeLine: { position: 'absolute', top: -11, width: 100, height: 2 },
});
