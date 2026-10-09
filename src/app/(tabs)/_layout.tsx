import { TripProvider } from '@/context/TripContext';
import BottomTabNavigator from '@/navigation/BottomTabNavigator';

export default function TabsLayout() {
  return (
    <TripProvider>
      <BottomTabNavigator />
    </TripProvider>
  );
}
