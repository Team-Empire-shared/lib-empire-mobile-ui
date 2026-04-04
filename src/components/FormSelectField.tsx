import React from "react";
import {
  useController,
  useFormContext,
  type RegisterOptions,
  type FieldValues,
} from "react-hook-form";
import { FormSelect, type FormSelectProps } from "./FormSelect";

export interface FormSelectFieldProps
  extends Omit<FormSelectProps, "selectedValue" | "onValueChange" | "error"> {
  /** Field name — must match a key in your form's default values */
  name: string;
  /** Validation rules passed to react-hook-form's useController */
  rules?: RegisterOptions<FieldValues, string>;
}

/**
 * A FormSelect wired to react-hook-form context. Must be rendered
 * inside a <FormProvider>.
 *
 * @example
 * ```tsx
 * <FormSelectField
 *   name="country"
 *   label="Country"
 *   options={[{ value: "in", label: "India" }, { value: "ae", label: "UAE" }]}
 *   rules={{ required: "Country is required" }}
 * />
 * ```
 */
export function FormSelectField({ name, rules, ...props }: FormSelectFieldProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control, rules });

  return (
    <FormSelect
      {...props}
      selectedValue={field.value ?? ""}
      onValueChange={field.onChange}
      error={fieldState.error?.message}
    />
  );
}
