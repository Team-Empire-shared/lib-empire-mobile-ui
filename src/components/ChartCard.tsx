import { useEffect, useRef } from "react";
import { View, Text, Animated, type ViewStyle } from "react-native";

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartCardProps {
  /** Card title */
  title: string;
  /** Card subtitle */
  subtitle?: string;
  /** Bar chart data */
  data: ChartDataPoint[];
  /** Chart area height in px (default 140) */
  height?: number;
  /** Show x-axis labels (default true) */
  showLabels?: boolean;
  /** Trend text, e.g. "+12%" */
  trend?: string;
  /** Trend direction */
  trendDirection?: "up" | "down" | "flat";
  /** Default bar color (default #2563eb) */
  barColor?: string;
  /** Dark mode */
  dark?: boolean;
  /** Container style */
  style?: ViewStyle;
}

/**
 * Simple animated bar chart card. Bars grow from 0 on mount.
 *
 * ```tsx
 * <ChartCard
 *   title="Applications"
 *   data={[
 *     { label: "Mon", value: 12 },
 *     { label: "Tue", value: 28 },
 *     { label: "Wed", value: 18 },
 *   ]}
 *   trend="+12%"
 *   trendDirection="up"
 * />
 * ```
 */
export function ChartCard({
  title,
  subtitle,
  data,
  height = 140,
  showLabels = true,
  trend,
  trendDirection,
  barColor = "#2563eb",
  dark = false,
  style,
}: ChartCardProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const animValues = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animValues.map((anim, idx) =>
      Animated.timing(anim, {
        toValue: data[idx]?.value ?? 0,
        duration: 600,
        delay: idx * 60,
        useNativeDriver: false, // height animation requires layout driver
      }),
    );
    Animated.stagger(60, animations).start();
  }, [animValues, data]);

  const bg = dark ? "#1f2937" : "#fff";
  const textColor = dark ? "#f9fafb" : "#111827";
  const mutedColor = dark ? "#9ca3af" : "#6b7280";
  const trendColor = trendDirection === "up" ? "#059669" : trendDirection === "down" ? "#dc2626" : mutedColor;
  const trendArrow = trendDirection === "up" ? "\u2191" : trendDirection === "down" ? "\u2193" : "";

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderRadius: 14,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: textColor }}>{title}</Text>
          {subtitle && <Text style={{ fontSize: 12, color: mutedColor, marginTop: 2 }}>{subtitle}</Text>}
        </View>
        {trend && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: trendColor }}>
              {trendArrow} {trend}
            </Text>
          </View>
        )}
      </View>

      {/* Bars */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", height, gap: 6 }}>
        {data.map((point, idx) => {
          const barH = animValues[idx]!.interpolate({
            inputRange: [0, maxValue],
            outputRange: [0, height - (showLabels ? 20 : 0)],
            extrapolate: "clamp",
          });

          return (
            <View key={idx} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              <Animated.View
                style={{
                  width: "70%",
                  height: barH,
                  backgroundColor: point.color ?? barColor,
                  borderRadius: 4,
                  minHeight: 2,
                }}
              />
              {showLabels && (
                <Text style={{ fontSize: 10, color: mutedColor, marginTop: 4 }} numberOfLines={1}>
                  {point.label}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
