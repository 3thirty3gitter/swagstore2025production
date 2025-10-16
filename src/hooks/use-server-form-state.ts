'use client';

import {useActionState, useEffect, useState, useMemo, useRef} from 'react';
import {useForm, UseFormReturn, FieldValues} from 'react-hook-form';

type ServerAction<T> = (
  prevState: any,
  formData: FormData
) => Promise<{error?: string; fieldErrors?: any; success?: boolean} | void>;

export function useServerFormState<TFieldValues extends FieldValues>(
  action: ServerAction<TFieldValues>,
  initialData?: TFieldValues | null
): UseFormReturn<TFieldValues> & {
  formState: {isSubmitting: boolean; isSuccess: boolean};
  formAction: (payload: FormData) => void;
  formErrors: Record<keyof TFieldValues, string[]>;
  isSuccess: boolean;
  lastSubmittedValues?: Partial<TFieldValues> | null;
  lastActionResult?: any;
} {
  const [state, formAction] = useActionState(action, {
    error: undefined,
    fieldErrors: undefined,
    success: undefined,
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const lastSuccessStateRef = useRef<any>(null);
  const lastSubmittedValuesRef = useRef<Partial<TFieldValues> | null>(null);

  const form = useForm<TFieldValues>({
    defaultValues: initialData as any,
  });

  const {
    handleSubmit,
    formState: {isSubmitting},
    reset,
  } = form;

  useEffect(() => {
    // We only want to react to *new* successful submissions.
    if (state?.success && state !== lastSuccessStateRef.current) {
      lastSuccessStateRef.current = state;
      setIsSuccess(true);
      
      // Only reset the form fields if it was a creation (no initialData provided).
      // This prevents the edit form from being wiped after an update.
      if (!initialData) {
        reset();
      }
    } else if (!state?.success) {
      // If the state is not successful, reset the success flag.
      setIsSuccess(false);
    }
  }, [state, reset, initialData]);

  const formErrors = useMemo(
    () => state?.fieldErrors || {},
    [state?.fieldErrors]
  );

  return {
    ...form,
  // `formState` intentionally includes only a subset used by callers here.
  // Cast to `any` to avoid TypeScript mismatch with react-hook-form's detailed FormState type.
  formState: { isSubmitting, isSuccess } as any,
    formAction: (payload: FormData) => {
      // When a new action is dispatched, clear the success flag and the reference to the last success state.
      setIsSuccess(false);
      lastSuccessStateRef.current = null;
      // Capture the current form values so callers can reference them after a reset.
      try {
        // @ts-ignore - useForm provides getValues
        lastSubmittedValuesRef.current = form.getValues ? form.getValues() : null;
      } catch (e) {
        lastSubmittedValuesRef.current = null;
      }
      formAction(payload);
    },
    formErrors,
    isSuccess,
    lastSubmittedValues: lastSubmittedValuesRef.current,
    // Expose the raw last action result from the server so the UI can inspect ids or returned payloads.
    lastActionResult: state,
  };
}
