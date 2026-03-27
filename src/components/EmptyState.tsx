import { View, Text, type ViewStyle } from "react-native";
import { AnimatedButton } from "./AnimatedButton";
import { FadeInView } from "./FadeInView";

export interface EmptyStateProps {
  /** Large emoji or icon */
  icon?: string;
  /** Main title */
  title: string;
  /** Description text */
  subtitle?: string;
  /** Primary action button label */
  actionLabel?: string;
  /** Primary action callback */
  onAction?: () => void;
  /** Secondary action label */
  secondaryLabel?: string;
  /** Secondary action callback */
  onSecondary?: () => void;
  /** Button color (default #2563eb) */
  accentColor?: string;
  /** Dark mode */
  dark?: boolean;
  /** Container style */
  style?: ViewStyle;
}

/**
 * Premium empty state with icon, copy, and optional CTA.
 * Automatically fades in on mount.
 *
 * ```tsx
 * <EmptyState
 *   icon="💼"
 *   title="No jobs yet"
 *   subtitle="We're adding new opportunities daily. Set up alerts to get notified."
 *   actionLabel="Browse categories"
 *   onAction={() => router.push("/categories")}
 * />
 * ```
 */
export function EmptyState({
  icon = "📭",
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  accentColor = "#2563eb",
  dark = false,
  style,
}: EmptyStateProps) {
  const textColor = dark ? "#f9fafb" : "#111827";
  const mutedColor = dark ? "#9ca3af" : "#6b7280";

  return (
    <FadeInView delay={100} style={[{ alignItems: "center", paddingVertical: 48, paddingHorizontal: 32 }, style]}>
      {/* Icon circle */}
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: dark ? "#1f2937" : "#f3f4f6",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 36 }}>{icon}</Text>
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: textColor,
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      {/* Subtitle */}
      {subtitle && (
        <Text
          style={{
            fontSize: 14,
            color: mutedColor,
            textAlign: "center",
            lineHeight: 21,
            marginBottom: 24,
          }}
        >
          {subtitle}
        </Text>
      )}

      {/* Primary action */}
      {actionLabel && onAction && (
        <AnimatedButton
          label={actionLabel}
          onPress={onAction}
          style={{ backgroundColor: accentColor, minWidth: 180, marginBottom: secondaryLabel ? 10 : 0 }}
        />
      )}

      {/* Secondary action */}
      {secondaryLabel && onSecondary && (
        <AnimatedButton
          label={secondaryLabel}
          onPress={onSecondary}
          variant="outline"
          style={{ minWidth: 180 }}
        />
      )}
    </FadeInView>
  );
}
