import { View, Text, type ViewStyle } from "react-native";

export interface AvatarGroupUser {
  name: string;
  avatar?: string | null;
}

export interface AvatarGroupProps {
  /** Array of users */
  users: AvatarGroupUser[];
  /** Max visible avatars before +N (default 4) */
  max?: number;
  /** Avatar diameter in px (default 36) */
  size?: number;
  /** Container style */
  style?: ViewStyle;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const FALLBACK_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2"];

/**
 * Overlapping avatar group with "+N" overflow indicator.
 *
 * ```tsx
 * <AvatarGroup
 *   users={[{ name: "Alice" }, { name: "Bob" }, { name: "Carol" }, { name: "Dan" }, { name: "Eve" }]}
 *   max={3}
 * />
 * ```
 */
export function AvatarGroup({
  users,
  max = 4,
  size = 36,
  style,
}: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;
  const overlap = size * 0.3;
  const borderRadius = size / 2;

  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      {visible.map((user, idx) => {
        const bgColor = FALLBACK_COLORS[idx % FALLBACK_COLORS.length]!;

        if (user.avatar) {
          // Try expo-image, fallback to RN Image
          let ImageComp: any;
          try {
            ImageComp = require("expo-image").Image;
          } catch {
            ImageComp = require("react-native").Image;
          }
          return (
            <View
              key={idx}
              style={{
                marginLeft: idx === 0 ? 0 : -overlap,
                zIndex: visible.length - idx,
                borderWidth: 2,
                borderColor: "#fff",
                borderRadius,
              }}
            >
              <ImageComp
                source={{ uri: user.avatar }}
                style={{ width: size, height: size, borderRadius }}
              />
            </View>
          );
        }

        return (
          <View
            key={idx}
            style={{
              width: size + 4,
              height: size + 4,
              borderRadius: (size + 4) / 2,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: idx === 0 ? 0 : -overlap,
              zIndex: visible.length - idx,
            }}
          >
            <View
              style={{
                width: size,
                height: size,
                borderRadius,
                backgroundColor: bgColor,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: size * 0.35, fontWeight: "700", color: "#fff" }}>
                {getInitials(user.name)}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Overflow circle */}
      {overflow > 0 && (
        <View
          style={{
            width: size + 4,
            height: size + 4,
            borderRadius: (size + 4) / 2,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: -overlap,
            zIndex: 0,
          }}
        >
          <View
            style={{
              width: size,
              height: size,
              borderRadius,
              backgroundColor: "#e5e7eb",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: size * 0.32, fontWeight: "700", color: "#374151" }}>
              +{overflow}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
