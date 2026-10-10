import { Platform, ViewStyle } from 'react-native';

export const lightColors = {
  background: '#F7F6F1',
  surface: '#FFFFFF',
  surfaceMuted: '#EFF3EE',
  primary: '#216B45',
  primaryDark: '#143F2B',
  primarySoft: '#DDEDE2',
  mint: '#BFDCC8',
  eco: '#216B45',
  ecoSoft: '#E1F1E6',
  coral: '#E9654F',
  teal: '#2D7E86',
  tealSoft: '#E1F0F1',
  text: '#19231D',
  textMuted: '#687168',
  border: '#DCE4DC',
  lavender: '#E8ECF6',
  amber: '#EFAF32',
  amberSoft: '#FFF0CF',
  danger: '#CA4E45',
  map: '#D7EBDD',
} as const;

export type AppColors = { [Key in keyof typeof lightColors]: string };

export const darkColors: AppColors = {
  background: '#101713',
  surface: '#151D19',
  surfaceMuted: '#202A24',
  primary: '#65C693',
  primaryDark: '#D7F5E4',
  primarySoft: '#223A2D',
  mint: '#3F6A50',
  eco: '#65C693',
  ecoSoft: '#1D3427',
  coral: '#FF836E',
  teal: '#69B9C2',
  tealSoft: '#1D3639',
  text: '#F2F6F3',
  textMuted: '#A6B3AA',
  border: '#334239',
  lavender: '#252A3B',
  amber: '#F4BE55',
  amberSoft: '#3E321D',
  danger: '#F47B72',
  map: '#203629',
};

// Kept as the light palette for older decorative components.
export const colors = lightColors;

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
    shadowColor: '#173B2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  android: { elevation: 3 },
  default: { boxShadow: '0 5px 18px rgba(23, 59, 42, 0.1)' },
}) as ViewStyle;
