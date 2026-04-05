import { useCallback } from "react";
import { ScrollView, TouchableOpacity, Text, type ViewStyle } from "react-native";

export interface FilterChipOption {
  label: string;
  value: string;
}

export interface FilterChipsProps {
  /** Available filter options */
  options: FilterChipOption[];
  /** Selected value(s) */
  selected: string | string[];
  /** Selection handler */
  onSelect: (selected: string | string[]) => void;
  /** Allow multiple selections (default false) */
  multiSelect?: boolean;
  /** Active chip color (default #2563eb) */
  activeColor?: string;
  /** Dark mode */
  dark?: boolean;
  /** Container style */
  style?: ViewStyle;
}

/**
 * Horizontal scrollable filter chip row with single or multi-select.
 *
 * ```tsx
 * <FilterChips
 *   options={[{ label: "All", value: "all" }, { label: "Active", value: "active" }]}
 *   selected="all"
 *   onSelect={setFilter}
 * />
 * ```
 */
export function FilterChips({
  options,
  selected,
  onSelect,
  multiSelect = false,
  activeColor = "#2563eb",
  dark = false,
  style,
}: FilterChipsProps) {
  const selectedSet = new Set(Array.isArray(selected) ? selected : [selected]);

  const handlePress = useCallback(
    (value: string) => {
      if (multiSelect) {
        const current = new Set(Array.isArray(selected) ? selected : [selected]);
        if (current.has(value)) {
          current.delete(value);
        } else {
          current.add(value);
        }
        onSelect(Array.from(current));
      } else {
        onSelect(value);
      }
    },
    [selected, multiSelect, onSelect],
  );

  const inactiveBg = dark ? "#374151" : "#f3f4f6";
  const inactiveText = dark ? "#d1d5db" : "#374151";

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[{ gap: 8, paddingVertical: 4 }, style as any]}
    >
      {options.map((opt) => {
        const isActive = selectedSet.has(opt.value);
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => handlePress(opt.value)}
            style={{
              backgroundColor: isActive ? activeColor : inactiveBg,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 7,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: isActive ? "600" : "400",
                color: isActive ? "#fff" : inactiveText,
              }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
