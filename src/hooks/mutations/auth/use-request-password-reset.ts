import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset } from "@/api/auth";
import type { UseMutationCallback } from "@/types";

export function useRequestPasswordReset(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
    onSuccess: () => callbacks?.onSuccess?.(),
    onError: (error) => callbacks?.onError?.(error as Error),
  });
}
