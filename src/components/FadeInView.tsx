import { useRef, useEffect } from "react";
import { Animated, type StyleProp, type ViewStyle } from "react-native";
import { animations } from "../lib/theme";

export interface FadeInViewProps {
  children: React.ReactNode;
  /** Delay in ms before animation starts (default 0) */
  delay?: number;
  /** Duration in ms (default animations.durations.normal = 300) */
  duration?: number;
  /** Slide up distance in pixels (default 16) */
  slideUp?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Wraps children in a fade-in + slide-up animation on mount.
 * Use on screen headers, stat cards, sections.
 *
 * ```tsx
 * <FadeInView delay={100}>
 *   <Text style={typography.h1}>Dashboard</Text>
 * </FadeInView>
 * ```
 */
export function FadeInView({
  children,
  delay = 0,
  duration = animations.durations.normal,
  slideUp = 16,
  style,
}: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(slideUp)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, duration, delay]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
