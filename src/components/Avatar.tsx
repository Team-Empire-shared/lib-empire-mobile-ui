import { View, Text } from "react-native";

export interface AvatarProps {
  name?: string;
  uri?: string | null;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  /** Accessibility label (defaults to "${name}'s avatar" or "User avatar") */
  accessibilityLabel?: string;
}

/**
 * Avatar with initials fallback.
 * When expo-image is installed, pass uri for remote images.
 * Falls back to initials circle when no uri is provided.
 */
export function Avatar({
  name = "?",
  uri,
  size = 40,
  backgroundColor = "#e0e7ff",
  textColor = "#2563eb",
  accessibilityLabel: a11yLabel,
}: AvatarProps) {
  const defaultA11yLabel = name && name !== "?" ? `${name}'s avatar` : "User avatar";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const fontSize = Math.round(size * 0.38);
  const borderRadius = size / 2;

  if (uri) {
    // Try expo-image if available, otherwise use RN Image
    try {
      const { Image } = require("expo-image");
      return (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius }}
          contentFit="cover"
          placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
          transition={200}
          accessibilityRole="image"
          accessibilityLabel={a11yLabel ?? defaultA11yLabel}
        />
      );
    } catch {
      const { Image } = require("react-native");
      return (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius }}
          accessibilityRole="image"
          accessibilityLabel={a11yLabel ?? defaultA11yLabel}
        />
      );
    }
  }

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={a11yLabel ?? defaultA11yLabel}
      style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize, fontWeight: "700", color: textColor }}>
        {initials}
      </Text>
    </View>
  );
}
