import { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: object;
  color?: string;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
  color = "#e5e7eb",
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[{ width, height, borderRadius, backgroundColor: color, opacity }, style]} />
  );
}

/** Card-shaped skeleton for list items */
export function SkeletonCard({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "#1f2937" : "#fff";
  const border = dark ? "#374151" : "#f3f4f6";
  const bone = dark ? "#374151" : "#e5e7eb";

  return (
    <View style={{ backgroundColor: bg, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: border }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Skeleton width="70%" height={14} color={bone} />
          <Skeleton width="40%" height={12} color={bone} style={{ marginTop: 8 }} />
        </View>
        <Skeleton width={72} height={24} borderRadius={12} color={bone} />
      </View>
      <Skeleton width="30%" height={10} color={bone} style={{ marginTop: 12 }} />
    </View>
  );
}

/** Stat cards skeleton for dashboards */
export function SkeletonStats({ count = 4, dark = false }: { count?: number; dark?: boolean }) {
  const bg = dark ? "#1f2937" : "#fff";
  const border = dark ? "#374151" : "#f3f4f6";
  const bone = dark ? "#374151" : "#e5e7eb";

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ width: "47%", backgroundColor: bg, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: border }}>
          <Skeleton width="60%" height={22} color={bone} />
          <Skeleton width="80%" height={10} color={bone} style={{ marginTop: 8 }} />
        </View>
      ))}
    </View>
  );
}

/** Full-screen detail skeleton */
export function SkeletonDetail({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "#1f2937" : "#fff";
  const border = dark ? "#374151" : "#f3f4f6";
  const bone = dark ? "#374151" : "#e5e7eb";

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
      <View style={{ backgroundColor: bg, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: border }}>
        <Skeleton width="60%" height={18} color={bone} />
        <Skeleton width="100%" height={12} color={bone} style={{ marginTop: 12 }} />
        <Skeleton width="100%" height={12} color={bone} style={{ marginTop: 8 }} />
        <Skeleton width="80%" height={12} color={bone} style={{ marginTop: 8 }} />
      </View>
      <View style={{ backgroundColor: bg, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: border, marginTop: 12 }}>
        <Skeleton width="40%" height={14} color={bone} />
        <Skeleton width="100%" height={48} color={bone} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
}
