import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  type ViewStyle,
} from "react-native";

export interface SearchBarProps {
  /** Current search value */
  value: string;
  /** Called after debounce with the search term */
  onSearch: (query: string) => void;
  /** Input placeholder (default "Search...") */
  placeholder?: string;
  /** Suggested search chips */
  suggestions?: string[];
  /** Recently searched terms */
  recentSearches?: string[];
  /** Clear all recent searches */
  onClearRecent?: () => void;
  /** Debounce interval in ms (default 300) */
  debounceMs?: number;
  /** Container style */
  style?: ViewStyle;
  /** Dark mode */
  dark?: boolean;
}

/**
 * Debounced search bar with optional suggestion and recent-search chips.
 *
 * ```tsx
 * <SearchBar
 *   value={query}
 *   onSearch={setQuery}
 *   placeholder="Search contacts..."
 *   suggestions={["Active", "VIP", "New"]}
 * />
 * ```
 */
export function SearchBar({
  value,
  onSearch,
  placeholder = "Search...",
  suggestions,
  recentSearches,
  onClearRecent,
  debounceMs = 300,
  style,
  dark = false,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (text: string) => {
      setLocalValue(text);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearch(text);
      }, debounceMs);
    },
    [onSearch, debounceMs],
  );

  const handleClear = useCallback(() => {
    setLocalValue("");
    onSearch("");
  }, [onSearch]);

  const handleChipPress = useCallback(
    (term: string) => {
      setLocalValue(term);
      onSearch(term);
    },
    [onSearch],
  );

  const bg = dark ? "#1f2937" : "#f3f4f6";
  const textColor = dark ? "#f9fafb" : "#111827";
  const mutedColor = dark ? "#9ca3af" : "#6b7280";
  const chipBg = dark ? "#374151" : "#e5e7eb";

  return (
    <View style={style}>
      {/* Input row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: bg,
          borderRadius: 12,
          paddingHorizontal: 12,
          height: 44,
        }}
      >
        <Text style={{ fontSize: 16, marginRight: 8, color: mutedColor }}>
          {"\u{1F50D}"}
        </Text>
        <TextInput
          value={localValue}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={mutedColor}
          style={{
            flex: 1,
            fontSize: 15,
            color: textColor,
            paddingVertical: 0,
          }}
          returnKeyType="search"
          autoCorrect={false}
        />
        {localValue.length > 0 && (
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ fontSize: 16, color: mutedColor }}>{"\u2715"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestion chips */}
      {suggestions && suggestions.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 8 }}
          contentContainerStyle={{ gap: 6 }}
        >
          {suggestions.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => handleChipPress(s)}
              style={{
                backgroundColor: chipBg,
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ fontSize: 13, color: textColor }}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Recent searches */}
      {recentSearches && recentSearches.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "600", color: mutedColor }}>Recent</Text>
            {onClearRecent && (
              <TouchableOpacity onPress={onClearRecent}>
                <Text style={{ fontSize: 12, color: "#2563eb" }}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {recentSearches.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => handleChipPress(r)}
                style={{
                  backgroundColor: chipBg,
                  borderRadius: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 12, color: mutedColor }}>{"\u{1F552}"}</Text>
                <Text style={{ fontSize: 13, color: textColor }}>{r}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
