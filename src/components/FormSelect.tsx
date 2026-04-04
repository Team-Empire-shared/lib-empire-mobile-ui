import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { colors, spacing, radius, fontSizes, fontWeights } from "../lib/theme";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  label: string;
  options: SelectOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export function FormSelect({
  label,
  options,
  selectedValue,
  onValueChange,
  placeholder = "Select...",
  error,
  disabled = false,
  containerStyle,
}: FormSelectProps) {
  const [visible, setVisible] = useState(false);
  const hasError = !!error;
  const selectedOption = options.find((o) => o.value === selectedValue);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.trigger,
          hasError && styles.triggerError,
          disabled && styles.triggerDisabled,
        ]}
        onPress={() => !disabled && setVisible(true)}
        activeOpacity={disabled ? 1 : 0.7}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedOption ? selectedOption.label : placeholder}`}
        accessibilityState={{ expanded: visible, disabled }}
      >
        <Text
          style={[
            styles.triggerText,
            !selectedOption && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>
      {hasError && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === selectedValue && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === selectedValue && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  triggerError: {
    borderColor: colors.danger,
  },
  triggerDisabled: {
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  triggerText: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textPlaceholder,
  },
  chevron: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: spacing["3xl"],
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: radius["2xl"],
    maxHeight: "70%",
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  optionSelected: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  cancelButton: {
    padding: spacing.lg,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  cancelText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textMuted,
  },
});
