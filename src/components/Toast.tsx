import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { create } from "zustand";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: ToastMessage[];
  show: (message: string, type?: ToastType) => void;
  remove: (id: number) => void;
}

let toastId = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, type = "info") => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  remove: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

/** Convenience functions — import and call from anywhere */
export const toast = {
  success: (message: string) => useToastStore.getState().show(message, "success"),
  error: (message: string) => useToastStore.getState().show(message, "error"),
  info: (message: string) => useToastStore.getState().show(message, "info"),
};

const COLORS: Record<ToastType, string> = {
  success: "#059669",
  error: "#dc2626",
  info: "#374151",
};

function ToastItem({ item }: { item: ToastMessage }) {
  const translateY = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -40, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }, 2600);

    return () => clearTimeout(timer);
  }, [translateY, opacity]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        marginHorizontal: 20,
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS[item.type],
      }}
    >
      <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{item.message}</Text>
    </Animated.View>
  );
}

export interface ToastContainerProps {
  topOffset?: number;
}

/** Place this component once in the root layout */
export function ToastContainer({ topOffset = 56 }: ToastContainerProps) {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <View
      style={{ position: "absolute", top: topOffset, left: 0, right: 0, zIndex: 9999 }}
      pointerEvents="none"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} item={t} />
      ))}
    </View>
  );
}
