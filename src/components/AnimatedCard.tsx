import { useRef, useCallback } from "react";
import {
  Animated,
  Pressable,
  type ViewStyle,
  type PressableProps,
} from "react-native";

export interface AnimatedCardProps extends Omit<PressableProps, "style"> {
  /** Card style */
  style?: ViewStyle;
  /** Scale when pressed (default 0.97) */
  pressScale?: number;
  /** Animation duration in ms (default 120) */
  duration?: number;
  /** Delay-based stagger index for list entrance animation */
  index?: number;
  /** Children */
  children: React.ReactNode;
}

/**
 * A pressable card that scales down on press and fades in on mount.
 * Drop-in replacement for TouchableOpacity on list cards.
 *
 * Usage:
 * ```tsx
 * <AnimatedCard onPress={() => router.push(`/job/${id}`)} index={i}>
 *   <Text>{title}</Text>
 * </AnimatedCard>
 * ```
 */
export function AnimatedCard({
  children,
  style,
  pressScale = 0.97,
  duration = 120,
  index = 0,
  onPress,
  ...rest
}: AnimatedCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  // Entrance animation — fade in + slide up with stagger
  const didAnimate = useRef(false);
  if (!didAnimate.current) {
    didAnimate.current = true;
    const delay = Math.min(index * 60, 600);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      toValue: pressScale,
      duration,
      useNativeDriver: true,
    }).start();
  }, [scale, pressScale, duration]);

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
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...rest}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale }, { translateY }],
            opacity,
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
