import { useState, useRef, useCallback } from "react";

export interface UseInfiniteListOptions<T> {
  /** Fetch function — receives offset and limit, returns items array */
  fetchFn: (params: { offset: number; limit: number; signal: AbortSignal }) => Promise<T[]>;
  /** Items per page (default: 20) */
  pageSize?: number;
}

export interface UseInfiniteListResult<T> {
  items: T[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
}

/**
 * Hook for infinite-scroll lists with pull-to-refresh.
 * Use with FlatList's onEndReached + refreshControl.
 */
export function useInfiniteList<T>({
  fetchFn,
  pageSize = 20,
}: UseInfiniteListOptions<T>): UseInfiniteListResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const loadingMore = useRef(false);

  const load = useCallback(
    (reset = false) => {
      if (loadingMore.current && !reset) return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const offset = reset ? 0 : items.length;
      if (reset) {
        setRefreshing(true);
        setError("");
      } else {
        loadingMore.current = true;
      }
      if (offset === 0) setLoading(true);

      fetchFn({ offset, limit: pageSize, signal: controller.signal })
        .then((data) => {
          if (controller.signal.aborted) return;
          if (reset) {
            setItems(data);
          } else {
            setItems((prev) => [...prev, ...data]);
          }
          setHasMore(data.length >= pageSize);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          if (offset === 0) setError("Failed to load. Pull down to retry.");
        })
        .finally(() => {
          if (controller.signal.aborted) return;
          setLoading(false);
          setRefreshing(false);
          loadingMore.current = false;
        });
    },
    [fetchFn, items.length, pageSize]
  );

  const refresh = useCallback(() => load(true), [load]);
  const loadMore = useCallback(() => {
    if (hasMore && !loading && !refreshing) load(false);
  }, [hasMore, loading, refreshing, load]);

  return { items, loading, refreshing, error, hasMore, loadMore, refresh, setItems };
}
