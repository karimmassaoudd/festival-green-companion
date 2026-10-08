import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type AppRoute = '/travel' | '/map';

export type FestivalTool = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: IconName;
  route?: AppRoute;
};

export type EcoQuest = {
  id: string;
  label: string;
  points: number;
  completed: boolean;
};

export type TravelOption = {
  id: string;
  name: string;
  detail: string;
  icon: IconName;
  duration: string;
  price: number;
  co2Kg: number;
  convenience: 'Low' | 'Medium' | 'High';
  sustainabilityNote?: string;
};

export type ArrivalPoint = {
  id: string;
  name: string;
  icon: IconName;
  walkMinutes: number;
  x: number;
  y: number;
};

export type EcoLocationType = 'water' | 'recycling' | 'cup' | 'food';

export type EcoLocation = {
  id: string;
  name: string;
  detail: string;
  type: EcoLocationType;
  icon: IconName;
  distanceMeters: number;
  walkMinutes: number;
  waitMinutes: number;
  x: number;
  y: number;
};
