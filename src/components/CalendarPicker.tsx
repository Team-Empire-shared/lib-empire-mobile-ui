import { useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, type ViewStyle } from "react-native";

export interface CalendarPickerProps {
  /** Selected date (single) or { start, end } (range) */
  value: Date | { start: Date; end?: Date } | null;
  /** Fires on date selection */
  onChange: (value: Date | { start: Date; end?: Date }) => void;
  /** Selection mode */
  mode?: "single" | "range";
  /** Earliest selectable date */
  minDate?: Date;
  /** Latest selectable date */
  maxDate?: Date;
  /** Primary color (default #2563eb) */
  accentColor?: string;
  /** Dark mode */
  dark?: boolean;
  /** Container style */
  style?: ViewStyle;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(day: Date, start: Date, end?: Date): boolean {
  if (!end) return false;
  const t = day.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

function isBeforeDay(a: Date, b: Date): boolean {
  const ac = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bc = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return ac.getTime() < bc.getTime();
}

/**
 * Month-grid calendar picker supporting single-date and date-range selection.
 *
 * ```tsx
 * <CalendarPicker value={selectedDate} onChange={setSelectedDate} mode="single" />
 * ```
 */
export function CalendarPicker({
  value,
  onChange,
  mode = "single",
  minDate,
  maxDate,
  accentColor = "#2563eb",
  dark = false,
  style,
}: CalendarPickerProps) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(() => {
    if (value instanceof Date) return value.getFullYear();
    if (value && "start" in value) return value.start.getFullYear();
    return today.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (value instanceof Date) return value.getMonth();
    if (value && "start" in value) return value.start.getMonth();
    return today.getMonth();
  });
  const [rangeStart, setRangeStart] = useState<Date | null>(
    value && "start" in (value as any) ? (value as { start: Date }).start : null,
  );

  const textColor = dark ? "#f9fafb" : "#111827";
  const mutedColor = dark ? "#6b7280" : "#9ca3af";
  const bg = dark ? "#1f2937" : "#fff";

  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const handleDayPress = useCallback(
    (day: number) => {
      const selected = new Date(viewYear, viewMonth, day);
      if (minDate && isBeforeDay(selected, minDate)) return;
      if (maxDate && isBeforeDay(maxDate, selected)) return;

      if (mode === "single") {
        onChange(selected);
        return;
      }

      // Range mode
      if (!rangeStart || (rangeStart && value && "end" in (value as any) && (value as any).end)) {
        // Start new range
        setRangeStart(selected);
        onChange({ start: selected });
      } else {
        // Complete range
        if (isBeforeDay(selected, rangeStart)) {
          onChange({ start: selected, end: rangeStart });
        } else {
          onChange({ start: rangeStart, end: selected });
        }
        setRangeStart(null);
      }
    },
    [viewYear, viewMonth, mode, rangeStart, value, onChange, minDate, maxDate],
  );

  // Determine selected state for a day
  const getDayState = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const isToday = isSameDay(d, today);
    let isSelected = false;
    let inRange = false;

    if (mode === "single" && value instanceof Date) {
      isSelected = isSameDay(d, value);
    } else if (value && "start" in (value as any)) {
      const rv = value as { start: Date; end?: Date };
      isSelected = isSameDay(d, rv.start) || (rv.end ? isSameDay(d, rv.end) : false);
      inRange = isInRange(d, rv.start, rv.end);
    }

    const disabled =
      (minDate && isBeforeDay(d, minDate)) || (maxDate && isBeforeDay(maxDate, d));

    return { isToday, isSelected, inRange, disabled };
  };

  return (
    <View style={[{ backgroundColor: bg, borderRadius: 14, padding: 16 }, style]}>
      {/* Month navigation */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity onPress={prevMonth} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={{ fontSize: 20, color: textColor }}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 15, fontWeight: "700", color: textColor }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={nextMonth} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={{ fontSize: 20, color: textColor }}>{"\u203A"}</Text>
        </TouchableOpacity>
      </View>

      {/* Day-of-week header */}
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        {DAYS.map((d) => (
          <View key={d} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 12, fontWeight: "600", color: mutedColor }}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      {Array.from({ length: cells.length / 7 }, (_, weekIdx) => (
        <View key={weekIdx} style={{ flexDirection: "row" }}>
          {cells.slice(weekIdx * 7, weekIdx * 7 + 7).map((day, cellIdx) => {
            if (day === null) {
              return <View key={cellIdx} style={{ flex: 1, height: 38 }} />;
            }

            const state = getDayState(day);

            return (
              <TouchableOpacity
                key={cellIdx}
                onPress={() => handleDayPress(day)}
                disabled={!!state.disabled}
                style={{
                  flex: 1,
                  height: 38,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: state.isSelected
                    ? accentColor
                    : state.inRange
                      ? accentColor + "1A"
                      : "transparent",
                  borderRadius: state.isSelected ? 19 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: state.isToday || state.isSelected ? "700" : "400",
                    color: state.disabled
                      ? mutedColor
                      : state.isSelected
                        ? "#fff"
                        : state.isToday
                          ? accentColor
                          : textColor,
                  }}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
