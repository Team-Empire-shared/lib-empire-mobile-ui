import { useEffect, useRef, useState } from "react";
import { View, Text, Animated, type ViewStyle, type ImageStyle } from "react-native";

export interface CachedImageProps {
  /** Remote image URL */
  uri: string | null | undefined;
  /** Style applied to the image / fallback container */
  style?: ImageStyle | ViewStyle;
  /** Blurhash placeholder string (shown while loading) */
  placeholder?: string;
  /** Component to render on error instead of the default initials fallback */
  fallback?: React.ReactNode;
  /** Border radius for the image */
  borderRadius?: number;
  /** Resize mode — maps to expo-image contentFit */
  resizeMode?: "cover" | "contain" | "fill" | "none";
  /** Initials or label shown when image fails and no custom fallback given */
  alt?: string;
}

/**
 * CachedImage — wraps expo-image with memory-disk caching, shimmer placeholder,
 * and graceful error fallback.
 *
 * Uses the same try/require pattern as Avatar so it degrades when expo-image
 * is not installed.
 */
export function CachedImage({
  uri,
  style,
  placeholder,
  fallback,
  borderRadius = 0,
  resizeMode = "cover",
  alt,
}: CachedImageProps) {
  const [errored, setErrored] = useState(false);
  const shimmerOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerOpacity]);

  // No URI or load error — show fallback
  if (!uri || errored) {
    if (fallback) {
      return <>{fallback}</>;
    }

    const initials = alt
      ? alt
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

    return (
      <View
        style={[
          {
            borderRadius,
            backgroundColor: "#e5e7eb",
            justifyContent: "center",
            alignItems: "center",
          },
          style as ViewStyle,
        ]}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#6b7280" }}>
          {initials}
        </Text>
      </View>
    );
  }

  // Try expo-image first (preferred — has built-in caching)
  try {
    const { Image } = require("expo-image");
    return (
      <Image
        source={{ uri }}
        style={[{ borderRadius }, style]}
        contentFit={resizeMode}
        cachePolicy="memory-disk"
        placeholder={placeholder ? { blurhash: placeholder } : undefined}
        transition={200}
        onError={() => setErrored(true)}
      />
    );
  } catch {
    // expo-image not installed — fall back to RN Image with shimmer
  }

  // Fallback: React Native Image + shimmer overlay while loading
  const { Image: RNImage } = require("react-native");
  const [loading, setLoading] = useState(true);

  return (
    <View style={[{ borderRadius, overflow: "hidden" }, style as ViewStyle]}>
      <RNImage
        source={{ uri }}
        style={{ width: "100%", height: "100%", borderRadius }}
        resizeMode={resizeMode}
        onLoad={() => setLoading(false)}
        onError={() => setErrored(true)}
      />
      {loading && (
        <Animated.View
          style={{
            ...({} as ViewStyle),
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#e5e7eb",
            opacity: shimmerOpacity,
            borderRadius,
          }}
        />
      )}
    </View>
  );
}
