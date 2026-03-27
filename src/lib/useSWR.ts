import { useState, useEffect, useCallback, useRef } from "react";
import { getCached, setCached, timeAgo } from "./cache";

export interface UseSWROptions<T> {
  /** Unique cache key */
  key: string;
  /** Fetch function — returns data */
  fetcher: (signal: AbortSignal) => Promise<T>;
  /** Cache TTL in ms (default 5 min) */
  ttlMs?: number;
  /** Auto-refetch on mount (default true) */
  autoFetch?: boolean;
  /** Cache prefix (default "empire_cache:") */
  cachePrefix?: string;
}

export interface UseSWRResult<T> {
  /** Current data (may be stale) */
  data: T | null;
  /** Loading fresh data */
  loading: boolean;
  /** Whether showing stale cached data */
  isStale: boolean;
  /** Human-readable "X ago" string for when data was last fetched */
  updatedAgo: string | null;
  /** Error message if fetch failed */
  error: string | null;
  /** Manually trigger refresh */
  refresh: () => void;
  /** Refreshing state (for pull-to-refresh) */
  refreshing: boolean;
}

/**
 * Stale-while-revalidate data hook.
 *
 * 1. Returns cached data instantly (if available)
 * 2. Fetches fresh data in background
 * 3. Updates cache + state when fresh data arrives
 * 4. Shows staleness indicator
 *
 * ```tsx
 * const { data, loading, isStale, updatedAgo, refresh, refreshing } = useSWR({
 *   key: "dashboard-stats",
 *   fetcher: (signal) => api.get("/api/v1/dashboard/stats", { signal }).then(r => r.data),
 * });
 * ```
 */
export function useSWR<T>({
  key,
  fetcher,
  ttlMs = 5 * 60 * 1000,
  autoFetch = true,
  cachePrefix,
}: UseSWROptions<T>): UseSWRResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [storedAt, setStoredAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Load cached data immediately on mount
  useEffect(() => {
    mountedRef.current = true;
    getCached<T>(key, cachePrefix).then((cached) => {
      if (!mountedRef.current) return;
      if (cached) {
        setData(cached.data);
        setStoredAt(cached.storedAt);
        setIsStale(cached.expired);
        setLoading(false);
      }
    });
    return () => { mountedRef.current = false; };
  }, [key, cachePrefix]);

  const fetchFresh = useCallback(
    (isRefresh = false) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (isRefresh) setRefreshing(true);
      if (!data) setLoading(true);
      setError(null);

      fetcher(controller.signal)
        .then((freshData) => {
          if (!mountedRef.current || controller.signal.aborted) return;
          setData(freshData);
          setIsStale(false);
          setStoredAt(Date.now());
          setError(null);
          // Persist to cache
          setCached(key, freshData, ttlMs, cachePrefix);
        })
        .catch((err) => {
          if (!mountedRef.current || controller.signal.aborted) return;
          // Only show error if we have no cached data at all
          if (!data) {
            setError("Failed to load. Pull down to retry.");
          }
          // If we have stale data, keep showing it — just mark stale
          if (data) setIsStale(true);
        })
        .finally(() => {
          if (!mountedRef.current || controller.signal.aborted) return;
          setLoading(false);
          setRefreshing(false);
        });
    },
    [key, fetcher, ttlMs, data, cachePrefix]
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) fetchFresh();
    return () => { abortRef.current?.abort(); };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(() => fetchFresh(true), [fetchFresh]);

  const updatedAgo = storedAt ? timeAgo(storedAt) : null;

  return { data, loading, isStale, updatedAgo, error, refresh, refreshing };
}
