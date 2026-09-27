import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

const ACTIVE_COLOR = '#2E7D32';
const INACTIVE_COLOR = '#68756A';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#F4FAF4' },
        headerShadowVisible: false,
        headerTitleStyle: { color: '#183A1D', fontWeight: '600' },
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: { borderTopColor: '#DCE8DD' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="travel"
        options={{
          title: 'Travel',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bus-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
