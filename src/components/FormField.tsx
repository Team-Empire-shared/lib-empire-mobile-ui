import React from "react";
import { type KeyboardTypeOptions } from "react-native";
import {
  useController,
  useFormContext,
  type RegisterOptions,
  type FieldValues,
} from "react-hook-form";
import { FormTextInput, type FormTextInputProps } from "./FormTextInput";

export interface FormFieldProps
  extends Omit<FormTextInputProps, "value" | "onChangeText" | "onBlur" | "error"> {
  /** Field name — must match a key in your form's default values */
  name: string;
  /** Validation rules passed to react-hook-form's useController */
  rules?: RegisterOptions<FieldValues, string>;
  /** Keyboard type */
  keyboardType?: KeyboardTypeOptions;
}

/**
 * A FormTextInput wired to react-hook-form context. Must be rendered
 * inside a <FormProvider>.
 *
 * @example
 * ```tsx
 * <FormField
 *   name="email"
 *   label="Email"
 *   placeholder="you@example.com"
 *   keyboardType="email-address"
 *   rules={{ required: "Email is required" }}
 * />
 * ```
 */
export function FormField({ name, rules, ...props }: FormFieldProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control, rules });

  return (
    <FormTextInput
      {...props}
      value={field.value ?? ""}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
      accessibilityLabel={props.accessibilityLabel ?? props.label}
    />
  );
}
