import { View, Text, type ViewStyle } from "react-native";

export interface TimelineEvent {
  /** Event title */
  title: string;
  /** Event description */
  description?: string;
  /** Timestamp string (displayed as-is) */
  timestamp: string;
  /** Status label (e.g. "Completed", "Pending") */
  status?: string;
  /** Dot color (default #2563eb) */
  color?: string;
}

export interface StatusTimelineProps {
  /** Timeline events (most recent first) */
  events: TimelineEvent[];
  /** Line color (default #e5e7eb) */
  lineColor?: string;
  /** Dark mode */
  dark?: boolean;
  /** Container style */
  style?: ViewStyle;
}

/**
 * Vertical timeline with colored status dots and descriptions.
 *
 * ```tsx
 * <StatusTimeline
 *   events={[
 *     { title: "Offer sent", timestamp: "Apr 5, 10:30 AM", color: "#059669" },
 *     { title: "Interview done", timestamp: "Apr 3, 2:00 PM", color: "#2563eb" },
 *   ]}
 * />
 * ```
 */
export function StatusTimeline({
  events,
  lineColor = "#e5e7eb",
  dark = false,
  style,
}: StatusTimelineProps) {
  const textColor = dark ? "#f9fafb" : "#111827";
  const mutedColor = dark ? "#9ca3af" : "#6b7280";

  return (
    <View style={style}>
      {events.map((event, idx) => {
        const isLast = idx === events.length - 1;
        const dotColor = event.color ?? "#2563eb";

        return (
          <View key={idx} style={{ flexDirection: "row" }}>
            {/* Dot + line column */}
            <View style={{ alignItems: "center", width: 24 }}>
              {/* Dot */}
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: dotColor,
                  marginTop: 4,
                }}
              />
              {/* Connector line */}
              {!isLast && (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    backgroundColor: lineColor,
                    minHeight: 24,
                  }}
                />
              )}
            </View>

            {/* Content */}
            <View style={{ flex: 1, paddingLeft: 12, paddingBottom: isLast ? 0 : 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: textColor, flex: 1 }}>
                  {event.title}
                </Text>
                {event.status && (
                  <View
                    style={{
                      backgroundColor: dotColor + "1A",
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      marginLeft: 8,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: "600", color: dotColor }}>
                      {event.status}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 12, color: mutedColor, marginTop: 2 }}>
                {event.timestamp}
              </Text>
              {event.description && (
                <Text style={{ fontSize: 13, color: mutedColor, marginTop: 4, lineHeight: 18 }}>
                  {event.description}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
