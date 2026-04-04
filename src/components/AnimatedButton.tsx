import { useRef, useCallback } from "react";
import {
  Animated,
  Pressable,
  Text,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { animations } from "../lib/theme";

export interface AnimatedButtonProps {
  /** Button label */
  label: string;
  /** Loading state label (default: "Loading...") */
  loadingLabel?: string;
  /** On press handler */
  onPress: () => void;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Button style */
  style?: ViewStyle;
  /** Text style */
  textStyle?: TextStyle;
  /** Scale when pressed (default 0.96) */
  pressScale?: number;
  /** Variant */
  variant?: "primary" | "outline" | "danger" | "success";
  /** Accessibility label (defaults to label text) */
  accessibilityLabel?: string;
}

const VARIANTS: Record<string, { bg: string; text: string; border?: string }> = {
  primary: { bg: "#2563eb", text: "#fff" },
  outline: { bg: "transparent", text: "#374151", border: "#d1d5db" },
  danger: { bg: "#dc2626", text: "#fff" },
  success: { bg: "#059669", text: "#fff" },
};

export function AnimatedButton({
  label,
  loadingLabel,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  pressScale = 0.96,
  variant = "primary",
  accessibilityLabel,
}: AnimatedButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const v = VARIANTS[variant] ?? VARIANTS.primary;

  const handlePressIn = useCallback(() => {
    if (disabled || loading) return;
    Animated.timing(scale, {
      toValue: pressScale,
      duration: animations.durations.instant,
      useNativeDriver: true,
    }).start();
  }, [scale, pressScale, disabled, loading]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={disabled || loading ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || loading }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: v.bg,
            borderRadius: 12,
            padding: 15,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            flexDirection: "row" as const,
            gap: 8,
            opacity: disabled || loading ? 0.5 : 1,
            borderWidth: v.border ? 1 : 0,
            borderColor: v.border,
            transform: [{ scale }],
          },
          style,
        ]}
      >
        {loading && <ActivityIndicator color={v.text} size="small" />}
        <Text
          style={[
            {
              color: v.text,
              fontWeight: "600" as const,
              fontSize: 15,
            },
            textStyle,
          ]}
        >
          {loading ? (loadingLabel ?? "Loading...") : label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
