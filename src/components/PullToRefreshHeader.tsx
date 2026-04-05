import { useEffect, useRef } from "react";
import { View, Text, Animated, type ViewStyle } from "react-native";

export interface PullToRefreshHeaderProps {
  /** Whether data is currently refreshing */
  refreshing: boolean;
  /** Last data update timestamp */
  lastUpdated?: Date | string | null;
  /** Brand accent color (default #2563eb) */
  brandColor?: string;
  /** Dark mode */
  dark?: boolean;
  /** Container style */
  style?: ViewStyle;
}

function timeAgoText(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Custom pull-to-refresh header with rotating brand icon and "last updated" text.
 * Place this above your ScrollView/FlatList content.
 *
 * ```tsx
 * <PullToRefreshHeader refreshing={isRefreshing} lastUpdated={lastFetch} />
 * ```
 */
export function PullToRefreshHeader({
  refreshing,
  lastUpdated,
  brandColor = "#2563eb",
  dark = false,
  style,
}: PullToRefreshHeaderProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (refreshing) {
      const animation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      );
      animation.start();
      return () => animation.stop();
    } else {
      rotation.setValue(0);
    }
  }, [refreshing, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const mutedColor = dark ? "#9ca3af" : "#6b7280";

  const lastDate = lastUpdated
    ? lastUpdated instanceof Date
      ? lastUpdated
      : new Date(lastUpdated)
    : null;

  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 12,
        },
        style,
      ]}
    >
      {/* Rotating icon */}
      <Animated.View
        style={{
          transform: [{ rotate: refreshing ? spin : "0deg" }],
          marginBottom: 6,
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: brandColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "800" }}>E</Text>
        </View>
      </Animated.View>

      {/* Status text */}
      <Text style={{ fontSize: 12, color: mutedColor }}>
        {refreshing
          ? "Updating..."
          : lastDate
            ? `Last updated ${timeAgoText(lastDate)}`
            : "Pull to refresh"}
      </Text>
    </View>
  );
}
