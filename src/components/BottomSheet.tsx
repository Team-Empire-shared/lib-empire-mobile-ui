import { useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  Animated,
  Pressable,
  Dimensions,
  PanResponder,
  type ViewStyle,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export interface BottomSheetProps {
  /** Whether the sheet is visible */
  visible: boolean;
  /** Called when the sheet should close */
  onClose: () => void;
  /** Sheet title */
  title?: string;
  /** Max height as fraction of screen (default 0.6) */
  maxHeight?: number;
  /** Children content */
  children: React.ReactNode;
  /** Container style */
  style?: ViewStyle;
}

/**
 * A bottom sheet modal with drag-to-dismiss.
 * No external dependencies — pure Animated API.
 *
 * ```tsx
 * <BottomSheet visible={showFilter} onClose={() => setShowFilter(false)} title="Filters">
 *   <FilterContent />
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  maxHeight = 0.6,
  children,
  style,
}: BottomSheetProps) {
  const sheetHeight = SCREEN_HEIGHT * maxHeight;
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const open = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, backdropOpacity]);

  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, [translateY, backdropOpacity, sheetHeight, onClose]);

  useEffect(() => {
    if (visible) open();
  }, [visible, open]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > sheetHeight * 0.3 || gesture.vy > 0.5) {
          close();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={close}>
      {/* Backdrop */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          opacity: backdropOpacity,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={close} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: sheetHeight,
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            transform: [{ translateY }],
          },
          style,
        ]}
      >
        {/* Drag handle */}
        <View {...panResponder.panHandlers} style={{ alignItems: "center", paddingVertical: 12 }}>
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#d1d5db",
            }}
          />
        </View>

        {/* Title */}
        {title && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#f3f4f6",
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#111827" }}>
              {title}
            </Text>
            <Pressable onPress={close} hitSlop={12}>
              <Text style={{ fontSize: 14, color: "#6b7280" }}>Done</Text>
            </Pressable>
          </View>
        )}

        {/* Content */}
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}>
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
}
