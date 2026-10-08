import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { ColorValue, StyleSheet, View } from 'react-native';

import { IconName } from '@/types/models';

const palette = {
  active: '#34815F',
  inactive: '#718096',
  border: '#E2E7EE',
};

export default function BottomTabNavigator() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.active,
        tabBarInactiveTintColor: palette.inactive,
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
          borderTopColor: palette.border,
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="travel"
        options={{
          title: 'Travel',
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'bus' : 'bus-outline'} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'map' : 'map-outline'} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color, focused }: { name: IconName; color: ColorValue; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      {focused ? <View style={styles.activeLine} /> : null}
      <Ionicons name={name} color={color} size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: { width: 100, alignItems: 'center' },
  activeLine: { position: 'absolute', top: -11, width: 100, height: 2, backgroundColor: palette.active },
});
