/**
 * Empire Design System — shared tokens across all 18 apps.
 * Each app uses its product theme on top of these base tokens.
 */

// ── Spacing Scale (4px base) ──
export const dsSpacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

// ── Border Radius ──
export const dsRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

// ── Typography Scale ──
export const dsFontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const dsFontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const dsLineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// ── Elevation / Shadows ──
export const elevation = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ── Animation Springs ──
export const springs = {
  gentle: { damping: 20, stiffness: 150, mass: 1 },
  snappy: { damping: 15, stiffness: 250, mass: 0.8 },
  bouncy: { damping: 10, stiffness: 200, mass: 1 },
  stiff: { damping: 30, stiffness: 400, mass: 1 },
} as const;

// ── Duration Presets ──
export const duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
} as const;

// ── Base Color Palette ──
export const palette = {
  // Neutrals
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  gray950: '#030712',

  // Brand
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',

  // Status
  green50: '#f0fdf4',
  green500: '#22c55e',
  green600: '#16a34a',
  red50: '#fef2f2',
  red500: '#ef4444',
  red600: '#dc2626',
  yellow50: '#fefce8',
  yellow500: '#eab308',
  amber500: '#f59e0b',
  orange500: '#f97316',
  purple500: '#a855f7',
  teal500: '#14b8a6',
} as const;

// ── Light Theme ──
export const lightTheme = {
  background: palette.white,
  surface: palette.gray50,
  card: palette.white,
  cardBorder: palette.gray200,
  border: palette.gray200,
  text: palette.gray900,
  textSecondary: palette.gray600,
  textMuted: palette.gray500,
  textPlaceholder: palette.gray400,
  primary: palette.blue600,
  primaryLight: palette.blue50,
  success: palette.green600,
  successLight: palette.green50,
  danger: palette.red600,
  dangerLight: palette.red50,
  warning: palette.amber500,
  warningLight: palette.yellow50,
  info: palette.blue500,
  skeleton: palette.gray200,
  overlay: 'rgba(0,0,0,0.5)',
  tabBar: palette.white,
  tabBarBorder: palette.gray200,
  statusBar: 'dark' as const,
};

// ── Dark Theme ──
export const darkTheme = {
  background: '#0a0a0f',
  surface: '#111118',
  card: '#1a1a24',
  cardBorder: '#2a2a38',
  border: '#2a2a38',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textPlaceholder: '#475569',
  primary: palette.blue500,
  primaryLight: 'rgba(59,130,246,0.15)',
  success: palette.green500,
  successLight: 'rgba(34,197,94,0.15)',
  danger: palette.red500,
  dangerLight: 'rgba(239,68,68,0.15)',
  warning: palette.amber500,
  warningLight: 'rgba(245,158,11,0.15)',
  info: palette.blue500,
  skeleton: '#2a2a38',
  overlay: 'rgba(0,0,0,0.7)',
  tabBar: '#111118',
  tabBarBorder: '#2a2a38',
  statusBar: 'light' as const,
};

export type ThemeColors = typeof lightTheme | typeof darkTheme;
