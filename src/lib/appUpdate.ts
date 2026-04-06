import { useCallback, useEffect, useRef, useState } from "react";

// Use require() instead of dynamic import() to avoid Metro async-require resolution issues
// with shared local packages. Falls back gracefully if expo-updates is not installed.
function getUpdates(): typeof import("expo-updates") | null {
  try {
    return require("expo-updates");
  } catch {
    return null;
  }
}

export interface UpdateStatus {
  isAvailable: boolean;
  isDownloading: boolean;
  isReady: boolean;
  manifest: any | null;
}

const initialStatus: UpdateStatus = {
  isAvailable: false,
  isDownloading: false,
  isReady: false,
  manifest: null,
};

/**
 * Check whether an OTA update is available.
 * Returns `{ available: true }` when a newer manifest exists on the server.
 * In __DEV__ mode expo-updates is inactive, so we short-circuit.
 */
export async function checkForUpdate(): Promise<{ available: boolean }> {
  if (__DEV__) return { available: false };

  try {
    const Updates = getUpdates();
    const result = await Updates.checkForUpdateAsync();
    return { available: result.isAvailable };
  } catch (err) {
    if (__DEV__) console.warn("[AppUpdate] checkForUpdate failed:", err);
    return { available: false };
  }
}

/**
 * Download the pending update and restart the app to apply it.
 * No-op in __DEV__.
 */
export async function fetchAndApplyUpdate(): Promise<void> {
  if (__DEV__) return;

  try {
    const Updates = getUpdates();
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  } catch (err) {
    if (__DEV__) console.warn("[AppUpdate] fetchAndApplyUpdate failed:", err);
    // Swallow — never crash the app for update failures
  }
}

/**
 * Hook that checks for OTA updates on mount and optionally at a recurring
 * interval. Provides imperative `checkNow` and `applyUpdate` callbacks.
 *
 * @param options.checkOnMount  Run a check immediately on mount (default true)
 * @param options.checkInterval Milliseconds between automatic checks (0 = off)
 */
export function useAppUpdate(
  options?: { checkOnMount?: boolean; checkInterval?: number },
): {
  status: UpdateStatus;
  checkNow: () => Promise<void>;
  applyUpdate: () => Promise<void>;
} {
  const { checkOnMount = true, checkInterval = 0 } = options ?? {};
  const [status, setStatus] = useState<UpdateStatus>(initialStatus);
  const mountedRef = useRef(true);

  const checkNow = useCallback(async () => {
    if (__DEV__) return;

    try {
      const Updates = getUpdates();
      const result = await Updates.checkForUpdateAsync();
      if (mountedRef.current) {
        setStatus((prev) => ({
          ...prev,
          isAvailable: result.isAvailable,
          manifest: result.isAvailable ? (result as any).manifest ?? null : prev.manifest,
        }));
      }
    } catch (err) {
      if (__DEV__) console.warn("[AppUpdate] checkNow failed:", err);
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    if (__DEV__) return;

    try {
      const Updates = getUpdates();
      if (mountedRef.current) {
        setStatus((prev) => ({ ...prev, isDownloading: true }));
      }
      await Updates.fetchUpdateAsync();
      if (mountedRef.current) {
        setStatus((prev) => ({ ...prev, isDownloading: false, isReady: true }));
      }
      await Updates.reloadAsync();
    } catch (err) {
      if (mountedRef.current) {
        setStatus((prev) => ({ ...prev, isDownloading: false }));
      }
      if (__DEV__) console.warn("[AppUpdate] applyUpdate failed:", err);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (checkOnMount) {
      checkNow();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [checkOnMount, checkNow]);

  useEffect(() => {
    if (!checkInterval || checkInterval <= 0) return;
    const id = setInterval(checkNow, checkInterval);
    return () => clearInterval(id);
  }, [checkInterval, checkNow]);

  return { status, checkNow, applyUpdate };
}
