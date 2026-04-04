import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedItem<T = unknown> {
  data: T;
  storedAt: number;
  ttlMs: number;
}

/**
 * Retrieve a cached value. Returns stale data with storedAt even if expired,
 * so callers can show it while fetching fresh data (stale-while-revalidate).
 */
export async function getCached<T = unknown>(
  key: string,
  prefix = "empire_cache:"
): Promise<{ data: T; storedAt: number; expired: boolean } | null> {
  try {
    const raw = await AsyncStorage.getItem(`${prefix}${key}`);
    if (!raw) return null;

    const item: CachedItem<T> = JSON.parse(raw);
    const expired = Date.now() - item.storedAt > item.ttlMs;

    if (expired) {
      AsyncStorage.removeItem(`${prefix}${key}`).catch(() => {});
    }

    return { data: item.data, storedAt: item.storedAt, expired };
  } catch {
    return null;
  }
}

/**
 * Store a value in the cache with an optional TTL.
 */
export async function setCached<T = unknown>(
  key: string,
  data: T,
  ttlMs: number = DEFAULT_TTL_MS,
  prefix = "empire_cache:"
): Promise<void> {
  try {
    const item: CachedItem<T> = { data, storedAt: Date.now(), ttlMs };
    await AsyncStorage.setItem(`${prefix}${key}`, JSON.stringify(item));
  } catch {
    // Caching is best-effort
  }
}

/**
 * Remove all cache entries with the given prefix.
 */
export async function clearCache(prefix = "empire_cache:"): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((k) => k.startsWith(prefix));
    if (cacheKeys.length > 0) {
      await Promise.all(cacheKeys.map((k) => AsyncStorage.removeItem(k)));
    }
  } catch {
    // best-effort
  }
}

/**
 * Human-readable "X ago" string from a timestamp.
 */
export function timeAgo(storedAt: number): string {
  const seconds = Math.floor((Date.now() - storedAt) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
