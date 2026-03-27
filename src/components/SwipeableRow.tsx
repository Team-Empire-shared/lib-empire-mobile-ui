import { useRef } from "react";
import {
  View,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  type ViewStyle,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 80;

export interface SwipeAction {
  /** Label shown behind the card */
  label: string;
  /** Background color */
  color: string;
  /** Text color (default #fff) */
  textColor?: string;
  /** Callback when swiped past threshold */
  onAction: () => void;
}

export interface SwipeableRowProps {
  /** Content to render inside the row */
  children: React.ReactNode;
  /** Right swipe action (swipe right → left action revealed) */
  leftAction?: SwipeAction;
  /** Left swipe action (swipe left → right action revealed) */
  rightAction?: SwipeAction;
  /** Container style */
  style?: ViewStyle;
}

/**
 * Wraps a list item with swipe-to-reveal actions.
 * Swipe right → shows left action (e.g. approve/save)
 * Swipe left → shows right action (e.g. reject/delete)
 *
 * ```tsx
 * <SwipeableRow
 *   leftAction={{ label: "Approve", color: "#059669", onAction: handleApprove }}
 *   rightAction={{ label: "Reject", color: "#dc2626", onAction: handleReject }}
 * >
 *   <CandidateCard />
 * </SwipeableRow>
 * ```
 */
export function SwipeableRow({
  children,
  leftAction,
  rightAction,
  style,
}: SwipeableRowProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderMove: (_, gesture) => {
        // Limit swipe range
        if (gesture.dx > 0 && leftAction) {
          translateX.setValue(Math.min(gesture.dx, SWIPE_THRESHOLD + 20));
        } else if (gesture.dx < 0 && rightAction) {
          translateX.setValue(Math.max(gesture.dx, -(SWIPE_THRESHOLD + 20)));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD && leftAction) {
          // Trigger left action
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            leftAction.onAction();
            translateX.setValue(0);
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD && rightAction) {
          // Trigger right action
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            rightAction.onAction();
            translateX.setValue(0);
          });
        } else {
          // Snap back
          Animated.spring(translateX, {
            toValue: 0,
            friction: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={[{ overflow: "hidden", borderRadius: 14, marginBottom: 10 }, style]}>
      {/* Background actions */}
      <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, flexDirection: "row" }}>
        {/* Left action (revealed on right swipe) */}
        <View
          style={{
            flex: 1,
            backgroundColor: leftAction?.color ?? "#059669",
            justifyContent: "center",
            paddingLeft: 24,
          }}
        >
          {leftAction && (
            <Text style={{ color: leftAction.textColor ?? "#fff", fontWeight: "700", fontSize: 14 }}>
              {leftAction.label}
            </Text>
          )}
        </View>
        {/* Right action (revealed on left swipe) */}
        <View
          style={{
            flex: 1,
            backgroundColor: rightAction?.color ?? "#dc2626",
            justifyContent: "center",
            alignItems: "flex-end",
            paddingRight: 24,
          }}
        >
          {rightAction && (
            <Text style={{ color: rightAction.textColor ?? "#fff", fontWeight: "700", fontSize: 14 }}>
              {rightAction.label}
            </Text>
          )}
        </View>
      </View>

      {/* Foreground card */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{ transform: [{ translateX }] }}
      >
        {children}
      </Animated.View>
    </View>
  );
}
