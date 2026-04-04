import React from "react";
import {
  FormProvider as RHFFormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";

export interface FormProviderProps<T extends FieldValues = FieldValues> {
  /** The form instance returned by useForm() */
  form: UseFormReturn<T>;
  /** Form content — typically FormField, FormSelectField, FormSubmitButton */
  children: React.ReactNode;
}

/**
 * Wraps react-hook-form's FormProvider to give all child form components
 * access to the form context (control, formState, etc.).
 *
 * @example
 * ```tsx
 * const form = useForm({ defaultValues: { email: "" } });
 * return (
 *   <FormProvider form={form}>
 *     <FormField name="email" label="Email" />
 *     <FormSubmitButton label="Sign In" onPress={form.handleSubmit(onSubmit)} />
 *   </FormProvider>
 * );
 * ```
 */
export function FormProvider<T extends FieldValues = FieldValues>({
  form,
  children,
}: FormProviderProps<T>) {
  return <RHFFormProvider {...form}>{children}</RHFFormProvider>;
}
