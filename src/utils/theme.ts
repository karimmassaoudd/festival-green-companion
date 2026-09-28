import { Platform, ViewStyle } from 'react-native';

export const colors = {
  background: '#F7F6FD',
  surface: '#FFFFFF',
  surfaceMuted: '#F0F1FF',
  primary: '#27763A',
  primaryDark: '#19572A',
  primarySoft: '#DFF1E3',
  mint: '#CFF1D5',
  text: '#182019',
  textMuted: '#667067',
  border: '#E8E8F0',
  lavender: '#E9EBFF',
  amber: '#E8A82D',
  amberSoft: '#FFF0DA',
  danger: '#C43D35',
  map: '#D8F4DA',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  round: 999,
} as const;

export const cardShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#172019',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: { elevation: 2 },
  default: { boxShadow: '0 4px 14px rgba(23, 32, 25, 0.08)' },
}) as ViewStyle;
