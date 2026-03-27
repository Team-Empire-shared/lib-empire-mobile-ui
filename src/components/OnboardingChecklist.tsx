import { View, Text, Pressable } from "react-native";
import { FadeInView } from "./FadeInView";

export interface ChecklistItem {
  /** Step ID */
  id: string;
  /** Step label */
  label: string;
  /** Whether step is completed */
  completed: boolean;
  /** Action when tapped */
  onPress?: () => void;
}

export interface OnboardingChecklistProps {
  /** Title (default "Getting started") */
  title?: string;
  /** Checklist items */
  items: ChecklistItem[];
  /** Accent color for progress bar (default #2563eb) */
  accentColor?: string;
  /** Dark mode */
  dark?: boolean;
  /** Called when dismiss/close is tapped */
  onDismiss?: () => void;
}

/**
 * Onboarding checklist with progress bar.
 * Shows on dashboard for first-time users until all steps completed.
 *
 * ```tsx
 * <OnboardingChecklist
 *   items={[
 *     { id: "profile", label: "Complete your profile", completed: true },
 *     { id: "cv", label: "Upload your CV", completed: false, onPress: () => router.push("/profile") },
 *     { id: "apply", label: "Apply to your first job", completed: false, onPress: () => router.push("/(tabs)") },
 *   ]}
 *   onDismiss={() => setShowOnboarding(false)}
 * />
 * ```
 */
export function OnboardingChecklist({
  title = "Getting started",
  items,
  accentColor = "#2563eb",
  dark = false,
  onDismiss,
}: OnboardingChecklistProps) {
  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const allDone = completed === total;

  const bg = dark ? "#1f2937" : "#fff";
  const border = dark ? "#374151" : "#f3f4f6";
  const textColor = dark ? "#f9fafb" : "#111827";
  const mutedColor = dark ? "#9ca3af" : "#6b7280";
  const trackColor = dark ? "#374151" : "#e5e7eb";

  if (allDone) return null;

  return (
    <FadeInView delay={200}>
      <View
        style={{
          backgroundColor: bg,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: border,
          marginBottom: 16,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: "700", color: textColor }}>{title}</Text>
            <Text style={{ fontSize: 12, color: mutedColor, marginTop: 2 }}>
              {completed}/{total} complete
            </Text>
          </View>
          {onDismiss && (
            <Pressable onPress={onDismiss} hitSlop={12}>
              <Text style={{ fontSize: 13, color: mutedColor }}>Dismiss</Text>
            </Pressable>
          )}
        </View>

        {/* Progress bar */}
        <View style={{ height: 6, backgroundColor: trackColor, borderRadius: 3, marginBottom: 16 }}>
          <View
            style={{
              height: 6,
              backgroundColor: accentColor,
              borderRadius: 3,
              width: `${progress}%`,
            }}
          />
        </View>

        {/* Steps */}
        {items.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={item.completed ? undefined : item.onPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              borderTopWidth: index > 0 ? 1 : 0,
              borderTopColor: border,
              opacity: item.completed ? 0.5 : 1,
            }}
          >
            {/* Checkbox */}
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: item.completed ? "#059669" : trackColor,
                backgroundColor: item.completed ? "#059669" : "transparent",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {item.completed && (
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>✓</Text>
              )}
            </View>

            {/* Label */}
            <Text
              style={{
                fontSize: 14,
                color: item.completed ? mutedColor : textColor,
                fontWeight: item.completed ? "400" : "500",
                textDecorationLine: item.completed ? "line-through" : "none",
                flex: 1,
              }}
            >
              {item.label}
            </Text>

            {/* Arrow for incomplete items */}
            {!item.completed && item.onPress && (
              <Text style={{ fontSize: 14, color: mutedColor }}>›</Text>
            )}
          </Pressable>
        ))}
      </View>
    </FadeInView>
  );
}
