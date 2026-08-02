// @ts-ignore – expo-local-authentication is a peer dependency that may not be installed in consumer projects
import * as LocalAuthentication from "expo-local-authentication";
import { AppState, type AppStateStatus } from "react-native";
import { deleteItem, getItem, setItem } from "./storage";

const DEFAULT_LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Wall-clock of the last moment the user was verifiably present — the app in
 * the foreground with the lock satisfied. Persisted, because the whole point is
 * to survive the process dying.
 *
 * Not a secret: it is a timestamp, and an attacker who can write app storage
 * has already won. It lives in the same store as the session token only because
 * that is the storage helper this package already ships.
 */
const LAST_ACTIVE_KEY = "empireoe.biometric.lastActiveAt";

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

/** Record "the user is present right now". Best-effort; never throws. */
async function markActive(): Promise<void> {
  try {
    await setItem(LAST_ACTIVE_KEY, String(Date.now()));
  } catch {
    // Storage unavailable — degrade to the previous in-memory-only behaviour
    // rather than breaking the app's startup path.
  }
}

async function clearLastActive(): Promise<void> {
  try {
    await deleteItem(LAST_ACTIVE_KEY);
  } catch {
    /* best-effort */
  }
}

async function readLastActive(): Promise<number | null> {
  try {
    const raw = await getItem(LAST_ACTIVE_KEY);
    if (!raw) return null;
    const ts = Number(raw);
    return Number.isFinite(ts) && ts > 0 ? ts : null;
  } catch {
    return null;
  }
}

/** Raise the lock, preserving the long-standing fail-safe. */
async function engageLock(): Promise<void> {
  // Unchanged: never strand a user whose device cannot satisfy the prompt. A
  // device with no biometric hardware, or none enrolled, is never locked.
  const available = await isBiometricAvailable().catch(() => false);
  if (!available) return;
  locked = true;
  onLockChange?.(true);
}

/** Prompt biometric auth. Returns true on success. */
export async function authenticateWithBiometric(
  promptMessage = "Unlock app",
): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    fallbackLabel: "Use password",
    disableDeviceFallback: false,
  });
  if (result.success) {
    locked = false;
    // The user just proved presence — restart the idle clock, so killing the
    // app right after unlocking does not re-lock it on the next launch.
    await markActive();
    onLockChange?.(false);
  }
  return result.success;
}

/**
 * Decide the lock state for a FRESH PROCESS.
 *
 * `backgroundAt` and `locked` are module-level state, so killing the app wipes
 * them, and the AppState listener — which only fires on background→active —
 * never runs on a cold start. A relaunch therefore restored a fully unlocked
 * session straight from the stored token, however long the device had been
 * sitting. Reading a persisted timestamp at startup is what closes that.
 *
 * Exported so consumers can await the decision before their first paint, and so
 * it is testable; `startAppStateListener` already calls it for you.
 *
 * @returns whether the app ended up locked.
 */
export async function hydrateLockState(
  tokenKey: string,
  lockTimeoutMs = DEFAULT_LOCK_TIMEOUT_MS,
): Promise<boolean> {
  const token = await getItem(tokenKey);
  if (!token) {
    // Signed out: nothing to protect, and a stale timestamp left behind would
    // lock whoever signs in next.
    await clearLastActive();
    return false;
  }

  const lastActive = await readLastActive();

  // An unknown last-active alongside a live token means we cannot tell whether
  // the device idled for ten seconds or ten days, so we challenge. In practice
  // this fires at most once per install — the first launch after adopting this
  // version — because every path below records a timestamp afterwards.
  if (lastActive === null || Date.now() - lastActive >= lockTimeoutMs) {
    await engageLock();
    if (locked) return true;
  }

  await markActive();
  return false;
}

/**
 * Call once on app mount to start listening for background/foreground transitions.
 * When the app returns from background after `lockTimeoutMs`, triggers biometric lock.
 *
 * Also evaluates the persisted lock state immediately, so a cold start after an
 * idle period locks as well. That evaluation is asynchronous, so a consumer that
 * seeds its overlay from `isLocked()` at mount should also register
 * `setLockChangeListener` — that is what fires when the decision lands.
 */
export function startAppStateListener(
  tokenKey: string,
  lockTimeoutMs = DEFAULT_LOCK_TIMEOUT_MS,
): () => void {
  const handleChange = async (state: AppStateStatus) => {
    if (state === "background" || state === "inactive") {
      backgroundAt = Date.now();
      // Persist on the way out: this is the timestamp a later cold start reads.
      await markActive();
    } else if (state === "active") {
      const token = await getItem(tokenKey);
      if (!token) {
        backgroundAt = null;
        await clearLastActive();
        return;
      }
      // Prefer the in-memory mark; fall back to the persisted one so a
      // background transition the OS never delivered still counts.
      const since = backgroundAt ?? (await readLastActive());
      if (since && Date.now() - since >= lockTimeoutMs) {
        await engageLock();
      }
      backgroundAt = null;
      if (!locked) await markActive();
    }
  };

  // Cold-start evaluation. Fire-and-forget so the caller still receives its
  // unsubscribe function synchronously, exactly as before.
  void hydrateLockState(tokenKey, lockTimeoutMs);

  const subscription = AppState.addEventListener("change", handleChange);
  return () => subscription.remove();
}
