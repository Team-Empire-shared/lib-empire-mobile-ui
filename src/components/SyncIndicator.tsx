import { useEffect, useRef } from "react";
import { Animated, View, Text, type ViewStyle } from "react-native";

export type SyncStatus = "synced" | "syncing" | "pending" | "failed";

export interface SyncIndicatorProps {
  /** Current sync status */
  status: SyncStatus;
  /** Icon size in px (default 20) */
  size?: number;
  /** Container style */
  style?: ViewStyle;
}

const STATUS_CONFIG: Record<SyncStatus, { icon: string; color: string; label: string }> = {
  synced: { icon: "\u2601\uFE0F", color: "#059669", label: "Synced" },
  syncing: { icon: "\u21BB", color: "#2563eb", label: "Syncing" },
  pending: { icon: "\u23F2", color: "#d97706", label: "Pending" },
  failed: { icon: "\u2715", color: "#dc2626", label: "Failed" },
};

/**
 * Animated sync status indicator. Small enough for header placement.
 * Rotates when syncing, static for other states.
 *
 * ```tsx
 * <SyncIndicator status="syncing" />
 * ```
 */
export function SyncIndicator({
  status,
  size = 20,
  style,
}: SyncIndicatorProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const config = STATUS_CONFIG[status];

  useEffect(() => {
    if (status === "syncing") {
      const animation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );
      animation.start();
      return () => animation.stop();
    } else {
      rotation.setValue(0);
    }
  }, [status, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[{ flexDirection: "row", alignItems: "center", gap: 4 }, style]}>
      <Animated.View
        style={{
          transform: status === "syncing" ? [{ rotate: spin }] : [],
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: size * 0.8, color: config.color }}>
          {config.icon}
        </Text>
      </Animated.View>
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: config.color,
        }}
      />
    </View>
  );
}
