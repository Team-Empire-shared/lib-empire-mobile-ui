import { View, Text, type ViewStyle } from "react-native";

export interface MetricCardProps {
  /** Metric label */
  label: string;
  /** Current value */
  value: number;
  /** Previous value (for trend calculation) */
  previousValue?: number;
  /** Value format */
  format?: "number" | "currency" | "percent";
  /** Currency symbol (default "$") */
  currencySymbol?: string;
  /** Override trend text (e.g. "+12%") */
  trendOverride?: string;
  /** Sparkline data points (simple dot-line) */
  sparkline?: number[];
  /** Dark mode */
  dark?: boolean;
  /** Container style */
  style?: ViewStyle;
}

function formatValue(val: number, format: string, symbol: string): string {
  switch (format) {
    case "currency":
      return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    case "percent":
      return `${val.toFixed(1)}%`;
    default:
      return val.toLocaleString();
  }
}

function computeTrend(current: number, previous: number): { text: string; direction: "up" | "down" | "flat" } {
  if (previous === 0) return { text: "--", direction: "flat" };
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  if (Math.abs(pct) < 0.5) return { text: "0%", direction: "flat" };
  return {
    text: `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`,
    direction: pct > 0 ? "up" : "down",
  };
}

/**
 * KPI metric card with large value, trend indicator, and optional sparkline.
 *
 * ```tsx
 * <MetricCard label="Revenue" value={48500} previousValue={42000} format="currency" />
 * ```
 */
export function MetricCard({
  label,
  value,
  previousValue,
  format = "number",
  currencySymbol = "$",
  trendOverride,
  sparkline,
  dark = false,
  style,
}: MetricCardProps) {
  const bg = dark ? "#1f2937" : "#fff";
  const textColor = dark ? "#f9fafb" : "#111827";
  const mutedColor = dark ? "#9ca3af" : "#6b7280";

  const trend = previousValue != null ? computeTrend(value, previousValue) : null;
  const trendText = trendOverride ?? trend?.text;
  const trendDir = trend?.direction ?? "flat";
  const trendColor = trendDir === "up" ? "#059669" : trendDir === "down" ? "#dc2626" : mutedColor;
  const trendArrow = trendDir === "up" ? "\u2191" : trendDir === "down" ? "\u2193" : "";

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderRadius: 14,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 12, fontWeight: "500", color: mutedColor, marginBottom: 4 }}>
        {label}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: textColor }}>
          {formatValue(value, format, currencySymbol)}
        </Text>

        {trendText && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: trendColor }}>
              {trendArrow} {trendText}
            </Text>
          </View>
        )}
      </View>

      {/* Simple sparkline */}
      {sparkline && sparkline.length > 1 && (
        <View style={{ flexDirection: "row", alignItems: "flex-end", height: 24, marginTop: 12, gap: 2 }}>
          {(() => {
            const max = Math.max(...sparkline, 1);
            return sparkline.map((val, idx) => (
              <View
                key={idx}
                style={{
                  flex: 1,
                  height: (val / max) * 20 + 2,
                  backgroundColor: trendColor + "40",
                  borderRadius: 2,
                  minHeight: 2,
                }}
              />
            ));
          })()}
        </View>
      )}
    </View>
  );
}
