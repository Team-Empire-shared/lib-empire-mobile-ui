import { useEffect, useRef } from "react";
import { View, Text, Animated, type ViewStyle } from "react-native";

export interface StepProgressProps {
  /** Step labels */
  steps: string[];
  /** Current step index (0-based) */
  currentStep: number;
  /** Completed step circle color (default #2563eb) */
  completedColor?: string;
  /** Active step circle color (default #2563eb) */
  activeColor?: string;
  /** Inactive color (default #d1d5db) */
  inactiveColor?: string;
  /** Circle diameter (default 32) */
  circleSize?: number;
  /** Container style */
  style?: ViewStyle;
}

/**
 * Horizontal step progress indicator with numbered circles connected by lines.
 * Completed steps show a check mark, current step pulses.
 *
 * ```tsx
 * <StepProgress steps={["Apply", "Review", "Interview", "Offer"]} currentStep={1} />
 * ```
 */
export function StepProgress({
  steps,
  currentStep,
  completedColor = "#2563eb",
  activeColor = "#2563eb",
  inactiveColor = "#d1d5db",
  circleSize = 32,
  style,
}: StepProgressProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.18, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <View style={[{ flexDirection: "row", alignItems: "flex-start" }, style]}>
      {steps.map((label, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isLast = idx === steps.length - 1;

        const circleColor = isCompleted
          ? completedColor
          : isCurrent
            ? activeColor
            : inactiveColor;

        const circle = (
          <View
            style={{
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: circleColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isCompleted ? (
              <Text style={{ color: "#fff", fontSize: circleSize * 0.45, fontWeight: "700" }}>{"\u2713"}</Text>
            ) : (
              <Text style={{ color: isCurrent ? "#fff" : "#6b7280", fontSize: circleSize * 0.4, fontWeight: "600" }}>
                {idx + 1}
              </Text>
            )}
          </View>
        );

        return (
          <View key={idx} style={{ flex: isLast ? 0 : 1, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
              {/* Circle — wrap in Animated if current */}
              <View style={{ alignItems: "center" }}>
                {isCurrent ? (
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    {circle}
                  </Animated.View>
                ) : (
                  circle
                )}
              </View>

              {/* Connector line */}
              {!isLast && (
                <View
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: idx < currentStep ? completedColor : inactiveColor,
                    marginHorizontal: 4,
                  }}
                />
              )}
            </View>

            {/* Label */}
            <Text
              numberOfLines={2}
              style={{
                fontSize: 11,
                color: isCompleted || isCurrent ? "#111827" : "#9ca3af",
                fontWeight: isCurrent ? "600" : "400",
                textAlign: "center",
                marginTop: 6,
                width: circleSize + 20,
              }}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
