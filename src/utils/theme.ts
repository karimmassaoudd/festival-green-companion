import { Platform, ViewStyle } from 'react-native';

export const colors = {
  background: '#F3F7F4',
  surface: '#FFFFFF',
  surfaceMuted: '#EAF2ED',
  primary: '#0C6B4E',
  primaryDark: '#074936',
  primarySoft: '#D9EFE6',
  mint: '#BCE5D2',
  text: '#10251C',
  textMuted: '#5D7067',
  border: '#D7E4DC',
  lavender: '#E4F0EC',
  amber: '#E9A928',
  amberSoft: '#FFF3D6',
  danger: '#C4473D',
  map: '#D7EEDF',
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
    shadowColor: '#0B3022',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: { elevation: 2 },
  default: { boxShadow: '0 4px 14px rgba(11, 48, 34, 0.08)' },
}) as ViewStyle;
