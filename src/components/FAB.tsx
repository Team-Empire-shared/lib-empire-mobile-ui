import { useRef, useCallback } from "react";
import { Animated, Pressable, Text, type ViewStyle } from "react-native";

export interface FABProps {
  /** Label text (e.g. "+", "Post Job") */
  label?: string;
  /** Icon emoji or text (default "+") */
  icon?: string;
  /** On press handler */
  onPress: () => void;
  /** Background color (default #2563eb) */
  color?: string;
  /** Text/icon color (default #fff) */
  textColor?: string;
  /** Position from bottom (default 24) */
  bottom?: number;
  /** Position from right (default 20) */
  right?: number;
  /** Extended mode — shows label next to icon */
  extended?: boolean;
  /** Additional style */
  style?: ViewStyle;
}

/**
 * Floating Action Button — fixed position at bottom-right.
 * Use for primary creation actions on list screens.
 *
 * ```tsx
 * <FAB icon="+" label="Post Job" extended onPress={() => router.push("/job/new")} />
 * ```
 */
export function FAB({
  label,
  icon = "+",
  onPress,
  color = "#2563eb",
  textColor = "#fff",
  bottom = 24,
  right = 20,
  extended = false,
  style,
}: FABProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.9,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ position: "absolute", bottom, right, zIndex: 100 }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: color,
            borderRadius: extended ? 28 : 28,
            height: 56,
            minWidth: 56,
            paddingHorizontal: extended ? 20 : 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: extended ? 8 : 0,
            transform: [{ scale }],
            // Shadow
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
          },
          style,
        ]}
      >
        <Text style={{ fontSize: extended ? 18 : 24, color: textColor, fontWeight: "600" }}>
          {icon}
        </Text>
        {extended && label && (
          <Text style={{ fontSize: 15, fontWeight: "600", color: textColor }}>
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}
