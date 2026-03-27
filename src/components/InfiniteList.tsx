import { useState, useCallback, useRef } from "react";
import {
  FlatList,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  type ListRenderItem,
} from "react-native";
import { SkeletonCard } from "./Skeleton";

export interface InfiniteListProps<T> {
  /** Fetch function: receives { offset, limit, signal } and returns items */
  fetchFn: (params: { offset: number; limit: number; signal: AbortSignal }) => Promise<T[]>;
  /** Render each item */
  renderItem: ListRenderItem<T>;
  /** Unique key extractor */
  keyExtractor: (item: T, index: number) => string;
  /** Items per page (default 20) */
  pageSize?: number;
  /** Header component (title, search, etc.) */
  ListHeaderComponent?: React.ReactElement;
  /** Empty state component */
  ListEmptyComponent?: React.ReactElement;
  /** Accent color for refresh spinner (default #2563eb) */
  tintColor?: string;
  /** Dark mode */
  dark?: boolean;
  /** Style for the container */
  style?: object;
  /** Content container style */
  contentContainerStyle?: object;
}

export function InfiniteList<T>({
  fetchFn,
  renderItem,
  keyExtractor,
  pageSize = 20,
  ListHeaderComponent,
  ListEmptyComponent,
  tintColor = "#2563eb",
  dark = false,
  style,
  contentContainerStyle,
}: InfiniteListProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(
    (reset = false) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const offset = reset ? 0 : items.length;

      if (reset) {
        setRefreshing(true);
        setError("");
      } else if (offset > 0) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError("");
      }

      fetchFn({ offset, limit: pageSize, signal: controller.signal })
        .then((data) => {
          if (controller.signal.aborted) return;
          setItems(reset ? data : (prev) => [...prev, ...data]);
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
          setLoadingMore(false);
        });
    },
    [fetchFn, items.length, pageSize]
  );

  // Initial load
  const didMount = useRef(false);
  if (!didMount.current) {
    didMount.current = true;
    load(true);
  }

  const bg = dark ? "#111827" : "#f9fafb";

  if (loading && items.length === 0) {
    return (
      <View style={[{ flex: 1, backgroundColor: bg }, style]}>
        {ListHeaderComponent}
        <View style={{ paddingHorizontal: 20 }}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} dark={dark} />
          ))}
        </View>
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={[{ flex: 1, backgroundColor: bg }, style]}>
        {ListHeaderComponent}
        <Text
          style={{
            textAlign: "center",
            marginTop: 40,
            fontSize: 13,
            color: "#dc2626",
            paddingHorizontal: 20,
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={[{ flex: 1, backgroundColor: bg }, style]}
      contentContainerStyle={[{ paddingHorizontal: 20, paddingBottom: 20 }, contentContainerStyle]}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        ListEmptyComponent ?? (
          <Text
            style={{
              fontSize: 13,
              color: dark ? "#9ca3af" : "#9ca3af",
              textAlign: "center",
              marginTop: 40,
            }}
          >
            Nothing here yet.
          </Text>
        )
      }
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator color={tintColor} style={{ paddingVertical: 16 }} />
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => load(true)}
          tintColor={tintColor}
        />
      }
      onEndReached={() => {
        if (hasMore && !loadingMore && !refreshing) load(false);
      }}
      onEndReachedThreshold={0.3}
    />
  );
}
