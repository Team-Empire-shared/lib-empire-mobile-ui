import { TextStyle, ViewStyle } from "react-native";

// ── Colors ────────────────────────────────────────────────────────────────

export const colors = {
  // Brand
  primary: "#2563eb",
  primaryLight: "#eff6ff",
  primaryDark: "#1d4ed8",

  // Semantic
  success: "#059669",
  successLight: "#dcfce7",
  warning: "#d97706",
  warningLight: "#fef3c7",
  danger: "#dc2626",
  dangerLight: "#fef2f2",
  info: "#2563eb",
  infoLight: "#eff6ff",

  // Neutrals — light mode
  background: "#f9fafb",
  card: "#fff",
  cardBorder: "#f3f4f6",
  border: "#e5e7eb",
  inputBorder: "#d1d5db",
  text: "#111827",
  textSecondary: "#374151",
  textMuted: "#6b7280",
  textPlaceholder: "#9ca3af",

  // Neutrals — dark mode
  darkBackground: "#111827",
  darkCard: "#1f2937",
  darkCardBorder: "#374151",
  darkBorder: "#374151",
  darkInputBorder: "#4b5563",
  darkText: "#f9fafb",
  darkTextSecondary: "#e5e7eb",
  darkTextMuted: "#9ca3af",
  darkTextPlaceholder: "#6b7280",

  // Status pills
  statusNew: "#6b7280",
  statusActive: "#2563eb",
  statusPending: "#d97706",
  statusCompleted: "#059669",
  statusRejected: "#dc2626",

  white: "#fff",
  black: "#000",
  transparent: "transparent",
} as const;

// ── Per-product accent overrides ──────────────────────────────────────────

export const productColors = {
  empireo: "#2563eb",
  recruitment: "#2563eb",
  eoe: "#2563eb",
  lwe: "#7c3aed",
  afterServices: "#0d9488",
  egpn: "#f59e0b",
  codnov: "#3b82f6",
  empireDigital: "#2563eb",
} as const;

// ── Spacing ───────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  screenPadding: 20,
  screenTop: 60,
} as const;

// ── Border Radius ─────────────────────────────────────────────────────────

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  "2xl": 16,
  "3xl": 20,
  full: 9999,
  pill: 20,
} as const;

// ── Typography ────────────────────────────────────────────────────────────

export const fontSizes = {
  xs: 10,
  sm: 11,
  base: 13,
  md: 14,
  lg: 15,
  xl: 17,
  "2xl": 20,
  "3xl": 22,
  "4xl": 26,
  "5xl": 28,
} as const;

export const fontWeights = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

export const typography = {
  h1: { fontSize: fontSizes["3xl"], fontWeight: fontWeights.bold, color: colors.text } as TextStyle,
  h2: { fontSize: fontSizes["2xl"], fontWeight: fontWeights.bold, color: colors.text } as TextStyle,
  h3: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.text } as TextStyle,
  body: { fontSize: fontSizes.md, color: colors.textSecondary, lineHeight: 22 } as TextStyle,
  bodySmall: { fontSize: fontSizes.base, color: colors.textMuted } as TextStyle,
  caption: { fontSize: fontSizes.sm, color: colors.textMuted } as TextStyle,
  label: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textSecondary } as TextStyle,
  button: { fontSize: fontSizes.lg, fontWeight: fontWeights.semibold, color: colors.white } as TextStyle,
} as const;

// ── Common Styles ─────────────────────────────────────────────────────────

export const commonStyles = {
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,

  screenDark: {
    flex: 1,
    backgroundColor: colors.darkBackground,
  } as ViewStyle,

  screenContent: {
    padding: spacing.screenPadding,
    paddingTop: spacing.screenTop,
  } as ViewStyle,

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.md,
  } as ViewStyle,

  cardDark: {
    backgroundColor: colors.darkCard,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.darkCardBorder,
    marginBottom: spacing.md,
  } as ViewStyle,

  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
    fontSize: fontSizes.md,
    color: colors.text,
  } as ViewStyle,

  inputDark: {
    backgroundColor: colors.darkCard,
    borderWidth: 1,
    borderColor: colors.darkInputBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
    fontSize: fontSizes.md,
    color: colors.darkText,
  } as ViewStyle,

  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
  } as ViewStyle,

  buttonOutline: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
  } as ViewStyle,

  pill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  } as ViewStyle,

  row: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
} as const;
