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
} {
  const [state, formAction] = useActionState(action, {
    error: undefined,
    fieldErrors: undefined,
    success: undefined,
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const lastSuccessStateRef = useRef<any>(null);

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
    formState: {isSubmitting, isSuccess},
    formAction: (payload: FormData) => {
      // When a new action is dispatched, clear the success flag and the reference to the last success state.
      setIsSuccess(false);
      lastSuccessStateRef.current = null;
      formAction(payload);
    },
    formErrors,
    isSuccess,
  };
}
