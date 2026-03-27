import { View, Text } from "react-native";

export interface StalenessBadgeProps {
  /** Whether data is stale */
  isStale: boolean;
  /** "X ago" string from useSWR */
  updatedAgo: string | null;
  /** Dark mode */
  dark?: boolean;
}

/**
 * Shows "Updated X ago" with a dot indicator.
 * Green dot = fresh, yellow dot = stale.
 *
 * ```tsx
 * <StalenessBadge isStale={isStale} updatedAgo={updatedAgo} />
 * ```
 */
export function StalenessBadge({
  isStale,
  updatedAgo,
  dark = false,
}: StalenessBadgeProps) {
  if (!updatedAgo) return null;

  const dotColor = isStale ? "#d97706" : "#059669";
  const textColor = dark ? "#9ca3af" : "#6b7280";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: dotColor,
        }}
      />
      <Text style={{ fontSize: 11, color: textColor }}>
        Updated {updatedAgo}
      </Text>
    </View>
  );
}
