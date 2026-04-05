import { TextStyle, ViewStyle } from "react-native";

// ── Colors ────────────────────────────────────────────────────────────────

/** Default light palette — Stripe (`awesome-design-md-main/design-md/stripe/DESIGN.md`). */
export const colors = {
  // Brand
  primary: "#533afd",
  primaryLight: "#ecebff",
  primaryDark: "#4434d4",

  // Semantic
  success: "#15be53",
  successLight: "rgba(21, 190, 83, 0.18)",
  warning: "#9b6829",
  warningLight: "rgba(155, 104, 41, 0.14)",
  danger: "#ea2261",
  dangerLight: "rgba(234, 34, 97, 0.12)",
  info: "#533afd",
  infoLight: "#ecebff",

  // Neutrals — light mode
  background: "#ffffff",
  card: "#ffffff",
  cardBorder: "#e5edf5",
  border: "#e5edf5",
  inputBorder: "#e5edf5",
  text: "#061b31",
  textSecondary: "#273951",
  textMuted: "#64748d",
  textPlaceholder: "#64748d",

  // Neutrals — dark mode (blue undertone)
  darkBackground: "#0d253d",
  darkCard: "#1c1e54",
  darkCardBorder: "#2e2b8c",
  darkBorder: "#2e2b8c",
  darkInputBorder: "#3d3a7a",
  darkText: "#ffffff",
  darkTextSecondary: "#e5edf5",
  darkTextMuted: "#94a3b8",
  darkTextPlaceholder: "#64748d",

  // Status pills
  statusNew: "#64748d",
  statusActive: "#533afd",
  statusPending: "#9b6829",
  statusCompleted: "#15be53",
  statusRejected: "#ea2261",

  white: "#fff",
  black: "#000",
  transparent: "transparent",
} as const;

// ── Per-product accent overrides ──────────────────────────────────────────

/** Per-product accent keys — each brand maps to its reference design-md palette. */
export const productColors = {
  empireo: "#533afd",
  recruitment: "#533afd",
  eoe: "#533afd",
  lwe: "#533afd",
  afterServices: "#ff385c", // Airbnb Rausch Red
  egpn: "#00b9ff", // Wise Bright Blue
  codnov: "#5e6ad2", // Linear Indigo
  empireDigital: "#533afd",
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

// ── Apple Design System Colors ───────────────────────────────────────────

export const appleColors = {
  systemBlue: "#007AFF",
  systemGreen: "#34C759",
  systemOrange: "#FF9500",
  systemRed: "#FF3B30",
  systemYellow: "#FFCC00",
  systemPurple: "#AF52DE",
  systemPink: "#FF2D55",
  systemTeal: "#5AC8FA",
  label: "#1D1D1F",
  secondaryLabel: "#86868B",
  tertiaryLabel: "#AEAEB2",
  separator: "#C6C6C8",
  systemGray6: "#F2F2F7",
  systemBackground: "#FFFFFF",
  secondaryBackground: "#F2F2F7",
} as const;

/** Blue-tinted elevation — Stripe shadow stack (`rgba(50,50,93,0.25)` family). */
export const cardShadow: ViewStyle = {
  shadowColor: "#32325d",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.22,
  shadowRadius: 12,
  elevation: 4,
};

// ── Premium Dark Palette ─────────────────────────────────────────────────

/** OLED / premium dark shell — true black canvas, Stripe indigo surfaces + purple chrome. */
export const premiumDark = {
  ...colors,
  primary: "#665efd",
  primaryLight: "rgba(102, 94, 253, 0.22)",
  primaryDark: "#533afd",
  background: "#000000",
  card: "#1c1e54",
  cardBorder: "#2e2b8c",
  border: "#2e2b8c",
  inputBorder: "#3d3a7a",
  text: "#FFFFFF",
  textSecondary: "#e5edf5",
  textMuted: "#94a3b8",
};

/** Links on near-black marketing bands — Stripe purple-mid for contrast on `#000`. */
export const recruitmentMarketingLinkOnDark = "#665efd";

/** Recruitment / employer apps — same Stripe tokens as the shared default (`colors`). */
export const recruitmentTheme = {
  ...colors,
};

/** Tab bar for recruitment-family apps (Stripe hairline border). */
export function recruitmentPremiumTabBarOptions(accentColor: string = productColors.recruitment) {
  return {
    tabBarActiveTintColor: accentColor,
    tabBarInactiveTintColor: "#86868B",
    tabBarStyle: {
      backgroundColor: "#FFFFFF",
      borderTopWidth: 0.5,
      borderTopColor: "#e5edf5",
      paddingBottom: 4,
      height: 84,
    } as ViewStyle,
  };
}

/** LWE — alias of shared Stripe default. */
export const lweTheme = {
  ...colors,
};

// ── Codnov — Linear light theme ──────────────────────────────────────────

/**
 * Codnov (developer / project-management) — Linear light palette.
 * @see Shared/awesome-design-md-main/design-md/linear.app/DESIGN.md
 */
export const codnovTheme = {
  ...colors,
  primary: "#5e6ad2", // Linear indigo
  primaryLight: "rgba(94, 106, 210, 0.12)",
  primaryDark: "#4c5bc4",
  background: "#ffffff",
  card: "#ffffff",
  cardBorder: "#e6e6e8",
  border: "#e6e6e8",
  inputBorder: "#d7d8db",
  text: "#0c0d10", // Linear near-black ink
  textSecondary: "#3c4149",
  textMuted: "#6b6f76",
  textPlaceholder: "#8a8f98",
  info: "#5e6ad2",
  infoLight: "rgba(94, 106, 210, 0.12)",
} as const;

/**
 * Codnov mobile — Linear **dark** palette.
 * Web / dashboard use the light `codnovTheme`; native apps stay dark to
 * preserve the existing Codnov aesthetic.
 * @see Shared/awesome-design-md-main/design-md/linear.app/DESIGN.md
 */
export const codnovDarkTheme = {
  ...colors,
  primary: "#5e6ad2",
  primaryLight: "rgba(94, 106, 210, 0.22)",
  primaryDark: "#4c5bc4",
  background: "#08090a", // Linear deep canvas
  card: "#1a1b1e",
  cardBorder: "#26272b",
  border: "#26272b",
  inputBorder: "#2a2b2f",
  text: "#f7f8f8",
  textSecondary: "#d0d6e0",
  textMuted: "#8a8f98",
  textPlaceholder: "#62666d",
  info: "#5e6ad2",
  infoLight: "rgba(94, 106, 210, 0.22)",
} as const;

// ── EGPN — Wise bright-blue theme ────────────────────────────────────────

/**
 * EGPN (global partner network, B2B) — Wise palette.
 * @see Shared/awesome-design-md-main/design-md/wise/DESIGN.md
 */
export const egpnTheme = {
  ...colors,
  primary: "#00b9ff", // Wise bright blue
  primaryLight: "rgba(0, 185, 255, 0.14)",
  primaryDark: "#0099d6",
  background: "#ffffff",
  card: "#ffffff",
  cardBorder: "#e2e5ea",
  border: "#e2e5ea",
  inputBorder: "#d1d5db",
  text: "#0e1011",
  textSecondary: "#2c3038",
  textMuted: "#6f7787",
  textPlaceholder: "#9ba3b0",
  success: "#163300", // Wise dark green (brand accent)
  successLight: "rgba(22, 51, 0, 0.12)",
  info: "#00b9ff",
  infoLight: "rgba(0, 185, 255, 0.14)",
} as const;

/**
 * EGPN mobile — dark shell with Wise brand primary.
 * Keeps the existing dark canvas of the EGPN apps while switching the
 * accent to Wise bright blue for brand alignment.
 */
export const egpnDarkTheme = {
  ...premiumDark,
  primary: "#00b9ff",
  primaryLight: "rgba(0, 185, 255, 0.22)",
  primaryDark: "#0099d6",
  info: "#00b9ff",
  infoLight: "rgba(0, 185, 255, 0.22)",
} as const;

// ── After-Services — Airbnb Rausch theme ─────────────────────────────────

/**
 * Empire After Services (housing / post-arrival) — Airbnb palette.
 * @see Shared/awesome-design-md-main/design-md/airbnb/DESIGN.md
 */
export const afterServicesTheme = {
  ...colors,
  primary: "#ff385c", // Airbnb Rausch Red
  primaryLight: "rgba(255, 56, 92, 0.12)",
  primaryDark: "#e00b41",
  background: "#ffffff",
  card: "#ffffff",
  cardBorder: "#ebebeb",
  border: "#dddddd", // Airbnb separator
  inputBorder: "#b0b0b0",
  text: "#222222", // Airbnb "Hof" ink
  textSecondary: "#484848",
  textMuted: "#717171", // Airbnb "Foggy"
  textPlaceholder: "#b0b0b0",
  danger: "#c13515", // Airbnb Arches
  dangerLight: "rgba(193, 53, 21, 0.12)",
  info: "#ff385c",
  infoLight: "rgba(255, 56, 92, 0.12)",
} as const;

/**
 * After-Services mobile — dark shell with Airbnb Rausch Red primary.
 * Keeps existing dark canvas while aligning the accent with the
 * after-services-web Airbnb brand.
 */
export const afterServicesDarkTheme = {
  ...premiumDark,
  primary: "#ff385c",
  primaryLight: "rgba(255, 56, 92, 0.22)",
  primaryDark: "#e00b41",
  danger: "#c13515",
  dangerLight: "rgba(193, 53, 21, 0.22)",
  info: "#ff385c",
  infoLight: "rgba(255, 56, 92, 0.22)",
} as const;

// ── Premium Tab Bar Options ──────────────────────────────────────────────

export function premiumTabBarOptions(accentColor: string = "#533afd") {
  return {
    tabBarActiveTintColor: accentColor,
    tabBarInactiveTintColor: "#86868B",
    tabBarStyle: {
      backgroundColor: "#FFFFFF",
      borderTopWidth: 0.5,
      borderTopColor: "#e5edf5",
      paddingBottom: 4,
      height: 84,
    } as ViewStyle,
  };
}
