import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { colors, spacing, radius, fontSizes, fontWeights } from "../lib/theme";

export interface FormTextInputProps extends Omit<TextInputProps, "style"> {
  label: string;
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  /** Accessibility label (defaults to label text) */
  accessibilityLabel?: string;
  /** Accessibility hint (defaults to error message when present) */
  accessibilityHint?: string;
}

export function FormTextInput({
  label,
  error,
  disabled = false,
  leftIcon,
  containerStyle,
  accessibilityLabel: a11yLabel,
  accessibilityHint: a11yHint,
  ...inputProps
}: FormTextInputProps) {
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          hasError && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled,
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          accessible={true}
          accessibilityLabel={a11yLabel ?? label}
          accessibilityHint={a11yHint ?? (hasError ? error : undefined)}
          style={[
            styles.input,
            leftIcon ? styles.inputWithIcon : undefined,
            disabled ? styles.inputDisabled : undefined,
          ]}
          placeholderTextColor={colors.textPlaceholder}
          editable={!disabled}
          {...inputProps}
        />
      </View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.lg,
  },
  inputWrapperError: {
    borderColor: colors.danger,
  },
  inputWrapperDisabled: {
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  iconContainer: {
    paddingLeft: spacing.md,
  },
  input: {
    flex: 1,
    padding: spacing.lg,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  inputWithIcon: {
    paddingLeft: spacing.sm,
  },
  inputDisabled: {
    color: colors.textMuted,
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
