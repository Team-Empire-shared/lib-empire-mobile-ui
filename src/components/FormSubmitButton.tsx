import React from "react";
import { useFormContext } from "react-hook-form";
import { AnimatedButton, type AnimatedButtonProps } from "./AnimatedButton";

export interface FormSubmitButtonProps
  extends Omit<AnimatedButtonProps, "disabled" | "loading"> {
  /**
   * When true, the button is disabled even when the form is valid
   * (e.g. waiting for an external condition).
   */
  forceDisabled?: boolean;
}

/**
 * A submit button wired to react-hook-form context. Automatically
 * shows a loading spinner while the form is submitting and disables
 * itself when the form is invalid or already submitting.
 *
 * Must be rendered inside a <FormProvider>.
 *
 * @example
 * ```tsx
 * <FormSubmitButton
 *   label="Create Account"
 *   onPress={form.handleSubmit(onSubmit)}
 * />
 * ```
 */
export function FormSubmitButton({
  label = "Submit",
  forceDisabled = false,
  ...props
}: FormSubmitButtonProps) {
  const {
    formState: { isSubmitting, isValid },
  } = useFormContext();

  return (
    <AnimatedButton
      label={label}
      disabled={isSubmitting || !isValid || forceDisabled}
      loading={isSubmitting}
      accessibilityLabel={props.accessibilityLabel ?? label}
      {...props}
    />
  );
}
