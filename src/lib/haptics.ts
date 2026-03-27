import { Platform } from "react-native";

/**
 * Haptic feedback wrapper — gracefully degrades if expo-haptics is not installed.
 * Haptics are iOS/Android only (no-op on web).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Haptics: any = null;

try {
  if (Platform.OS !== "web") {
    Haptics = require("expo-haptics");
  }
} catch {
  // expo-haptics not installed — all functions become no-ops
}

/** Light tap — use for navigation, selection, toggle */
export function tapLight() {
  Haptics?.impactAsync?.(Haptics.ImpactFeedbackStyle.Light);
}

/** Medium tap — use for button press, card press */
export function tapMedium() {
  Haptics?.impactAsync?.(Haptics.ImpactFeedbackStyle.Medium);
}

/** Heavy tap — use for destructive actions, important confirmations */
export function tapHeavy() {
  Haptics?.impactAsync?.(Haptics.ImpactFeedbackStyle.Heavy);
}

/** Success vibration — use after save, apply, approve, complete */
export function notifySuccess() {
  Haptics?.notificationAsync?.(Haptics.NotificationFeedbackType.Success);
}

/** Error vibration — use after failed action, validation error */
export function notifyError() {
  Haptics?.notificationAsync?.(Haptics.NotificationFeedbackType.Error);
}

/** Warning vibration — use for destructive action confirmation */
export function notifyWarning() {
  Haptics?.notificationAsync?.(Haptics.NotificationFeedbackType.Warning);
}

/** Selection tick — use for picker changes, toggle switches */
export function selectionTick() {
  Haptics?.selectionAsync?.();
}
