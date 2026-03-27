import * as LocalAuthentication from "expo-local-authentication";
import { AppState, type AppStateStatus } from "react-native";
import { getItem } from "./storage";

const DEFAULT_LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

let backgroundAt: number | null = null;
let locked = false;
let onLockChange: ((locked: boolean) => void) | null = null;

export function setLockChangeListener(cb: (locked: boolean) => void) {
  onLockChange = cb;
}

export function isLocked(): boolean {
  return locked;
}

/** Returns true if device supports biometric auth. */
export async function isBiometricAvailable(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
}

/** Prompt biometric auth. Returns true on success. */
export async function authenticateWithBiometric(
  promptMessage = "Unlock app"
): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    fallbackLabel: "Use password",
    disableDeviceFallback: false,
  });
  if (result.success) {
    locked = false;
    onLockChange?.(false);
  }
  return result.success;
}

/**
 * Call once on app mount to start listening for background/foreground transitions.
 * When the app returns from background after `lockTimeoutMs`, triggers biometric lock.
 */
export function startAppStateListener(
  tokenKey: string,
  lockTimeoutMs = DEFAULT_LOCK_TIMEOUT_MS
): () => void {
  const handleChange = async (state: AppStateStatus) => {
    if (state === "background" || state === "inactive") {
      backgroundAt = Date.now();
    } else if (state === "active") {
      const token = await getItem(tokenKey);
      if (!token) {
        backgroundAt = null;
        return;
      }
      if (backgroundAt && Date.now() - backgroundAt >= lockTimeoutMs) {
        const available = await isBiometricAvailable();
        if (available) {
          locked = true;
          onLockChange?.(true);
        }
      }
      backgroundAt = null;
    }
  };

  const subscription = AppState.addEventListener("change", handleChange);
  return () => subscription.remove();
}
