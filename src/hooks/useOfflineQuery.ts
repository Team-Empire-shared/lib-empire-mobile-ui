/**
 * Hook that provides stale-while-revalidate with SQLite persistence.
 * Shows cached data instantly, fetches fresh in background, updates on success.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { offlineDb } from "../offline-database";
import NetInfo from "@react-native-community/netinfo";

interface UseOfflineQueryOptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  ttl?: number; // Cache TTL in ms (default 5 min)
  enabled?: boolean;
}

interface UseOfflineQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isStale: boolean;
  isOffline: boolean;
  error: Error | null;
  lastUpdated: number | null;
  refresh: () => Promise<void>;
  invalidate: () => Promise<void>;
}

export function useOfflineQuery<T>({
  key,
  fetcher,
  ttl = 5 * 60 * 1000,
  enabled = true,
}: UseOfflineQueryOptions<T>): UseOfflineQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Monitor network state
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      if (mountedRef.current) setIsOffline(!state.isConnected);
    });
    return unsub;
  }, []);

  const loadFromCache = useCallback(async () => {
    const cached = await offlineDb.get<T>(key);
    if (cached && mountedRef.current) {
      setData(cached.data);
      setIsStale(cached.isStale);
      setLastUpdated(cached.updatedAt);
      return true;
    }
    return false;
  }, [key]);

  const fetchFresh = useCallback(async () => {
    try {
      const fresh = await fetcher();
      if (mountedRef.current) {
        setData(fresh);
        setIsStale(false);
        setError(null);
        setLastUpdated(Date.now());
      }
      await offlineDb.set(key, fresh, ttl);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  }, [key, fetcher, ttl]);

  // Initial load: cache first, then fetch
  useEffect(() => {
    if (!enabled) return;

    (async () => {
      const hadCache = await loadFromCache();
      if (hadCache && mountedRef.current) {
        setIsLoading(false);
        // Background refresh
        setIsRefreshing(true);
        await fetchFresh();
        if (mountedRef.current) setIsRefreshing(false);
      } else {
        // No cache — must fetch
        await fetchFresh();
        if (mountedRef.current) setIsLoading(false);
      }
    })();
  }, [enabled, loadFromCache, fetchFresh]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    await fetchFresh();
    if (mountedRef.current) setIsRefreshing(false);
  }, [fetchFresh]);

  const invalidate = useCallback(async () => {
    await offlineDb.invalidate(key);
    await refresh();
  }, [key, refresh]);

  return {
    data,
    isLoading,
    isRefreshing,
    isStale,
    isOffline,
    error,
    lastUpdated,
    refresh,
    invalidate,
  };
}
