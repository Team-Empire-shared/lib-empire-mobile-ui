import { View, Text, type TextStyle } from "react-native";

export interface GradientHeaderProps {
  /** Main title */
  title: string;
  /** Subtitle text */
  subtitle?: string;
  /** Start color (top) */
  startColor?: string;
  /** End color (bottom) */
  endColor?: string;
  /** Title style override */
  titleStyle?: TextStyle;
  /** Right side component (e.g. button) */
  rightComponent?: React.ReactNode;
  /** Extra padding top (default 60 for safe area) */
  paddingTop?: number;
}

/**
 * A gradient-style header using a solid-to-transparent overlay effect.
 * Works without expo-linear-gradient by using opacity layers.
 *
 * For apps that want a branded dashboard header feel.
 */
export function GradientHeader({
  title,
  subtitle,
  startColor = "#1e3a5f",
  endColor = "#0f172a",
  titleStyle,
  rightComponent,
  paddingTop = 60,
}: GradientHeaderProps) {
  return (
    <View
      style={{
        backgroundColor: endColor,
        paddingTop,
        paddingHorizontal: 20,
        paddingBottom: 24,
      }}
    >
      {/* Gradient-like effect using an overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "60%",
          backgroundColor: startColor,
          opacity: 0.6,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              {
                fontSize: 24,
                fontWeight: "800",
                color: "#fff",
              },
              titleStyle,
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.7)",
                marginTop: 4,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {rightComponent}
      </View>
    </View>
  );
}
