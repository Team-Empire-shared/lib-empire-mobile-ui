import { View, Text, Pressable } from "react-native";

export interface ProfileCompletenessProps {
  /** Percentage complete (0-100) */
  percent: number;
  /** Label (default "Profile completeness") */
  label?: string;
  /** Action text (default "Complete now") */
  actionLabel?: string;
  /** Callback when tapped */
  onPress?: () => void;
  /** Accent color */
  accentColor?: string;
  /** Dark mode */
  dark?: boolean;
}

/**
 * Profile completeness bar for profile screens.
 * Shows progress + nudge to complete missing fields.
 *
 * ```tsx
 * <ProfileCompleteness percent={60} onPress={() => scrollToEditForm()} />
 * ```
 */
export function ProfileCompleteness({
  percent,
  label = "Profile completeness",
  actionLabel = "Complete now",
  onPress,
  accentColor = "#2563eb",
  dark = false,
}: ProfileCompletenessProps) {
  if (percent >= 100) return null;

  const bg = dark ? "#1f2937" : "#fff";
  const border = dark ? "#374151" : "#f3f4f6";
  const textColor = dark ? "#f9fafb" : "#111827";
  const mutedColor = dark ? "#9ca3af" : "#6b7280";
  const trackColor = dark ? "#374151" : "#e5e7eb";
  const barColor = percent < 40 ? "#dc2626" : percent < 70 ? "#d97706" : accentColor;

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: bg,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: border,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: textColor }}>{label}</Text>
        <Text style={{ fontSize: 13, fontWeight: "700", color: barColor }}>{percent}%</Text>
      </View>
      <View style={{ height: 6, backgroundColor: trackColor, borderRadius: 3 }}>
        <View style={{ height: 6, backgroundColor: barColor, borderRadius: 3, width: `${percent}%` }} />
      </View>
      {onPress && (
        <Text style={{ fontSize: 12, color: accentColor, fontWeight: "500", marginTop: 8 }}>
          {actionLabel} ›
        </Text>
      )}
    </Pressable>
  );
}
