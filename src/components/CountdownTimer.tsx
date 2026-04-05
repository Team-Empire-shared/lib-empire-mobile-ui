import { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, Animated, type ViewStyle } from "react-native";

export interface CountdownTimerProps {
  /** Target date/time to count down to */
  targetDate: Date | string;
  /** Called when countdown reaches zero */
  onExpire?: () => void;
  /** Label shown above the timer */
  label?: string;
  /** Accent color for urgent state (default #dc2626) */
  urgentColor?: string;
  /** Normal color (default #111827) */
  normalColor?: string;
  /** Dark mode */
  dark?: boolean;
  /** Container style */
  style?: ViewStyle;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function computeTimeLeft(target: Date): TimeLeft {
  const total = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Animated countdown timer showing days:hours:minutes:seconds.
 * Pulses when less than 1 hour remains.
 *
 * ```tsx
 * <CountdownTimer
 *   targetDate="2026-04-10T00:00:00Z"
 *   label="Application deadline"
 *   onExpire={() => toast.info("Deadline passed")}
 * />
 * ```
 */
export function CountdownTimer({
  targetDate,
  onExpire,
  label,
  urgentColor = "#dc2626",
  normalColor,
  dark = false,
  style,
}: CountdownTimerProps) {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => computeTimeLeft(target));
  const expiredRef = useRef(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const defaultNormal = dark ? "#f9fafb" : "#111827";
  const textColor = normalColor ?? defaultNormal;
  const mutedColor = dark ? "#9ca3af" : "#6b7280";

  // Tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      const tl = computeTimeLeft(target);
      setTimeLeft(tl);
      if (tl.total === 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [target, onExpire]);

  // Pulse when < 1 hour
  const isUrgent = timeLeft.total > 0 && timeLeft.total < 3600000;

  useEffect(() => {
    if (isUrgent) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isUrgent, pulseAnim]);

  const digitColor = isUrgent ? urgentColor : textColor;

  const renderSegment = (val: string, segLabel: string) => (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "800", color: digitColor, fontVariant: ["tabular-nums"] }}>
        {val}
      </Text>
      <Text style={{ fontSize: 10, fontWeight: "500", color: mutedColor, marginTop: 2 }}>
        {segLabel}
      </Text>
    </View>
  );

  const separator = (
    <Text style={{ fontSize: 24, fontWeight: "700", color: digitColor, marginHorizontal: 4, marginBottom: 14 }}>:</Text>
  );

  if (timeLeft.total === 0) {
    return (
      <View style={[{ alignItems: "center" }, style]}>
        {label && <Text style={{ fontSize: 12, color: mutedColor, marginBottom: 6 }}>{label}</Text>}
        <Text style={{ fontSize: 18, fontWeight: "700", color: urgentColor }}>Expired</Text>
      </View>
    );
  }

  return (
    <View style={[{ alignItems: "center" }, style]}>
      {label && <Text style={{ fontSize: 12, color: mutedColor, marginBottom: 8 }}>{label}</Text>}
      <Animated.View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          transform: [{ scale: pulseAnim }],
        }}
      >
        {timeLeft.days > 0 && (
          <>
            {renderSegment(String(timeLeft.days), "days")}
            {separator}
          </>
        )}
        {renderSegment(pad(timeLeft.hours), "hrs")}
        {separator}
        {renderSegment(pad(timeLeft.minutes), "min")}
        {separator}
        {renderSegment(pad(timeLeft.seconds), "sec")}
      </Animated.View>
    </View>
  );
}
