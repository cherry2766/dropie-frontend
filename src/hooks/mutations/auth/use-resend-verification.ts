import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "@/api/auth";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import type { UseMutationCallback } from "@/types";

export function useResendVerification(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: (email: string) => resendVerification(email),
    onSuccess: () => {
      showSuccessToast("인증 이메일을 재발송했습니다.");
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      showErrorToast(error);
      callbacks?.onError?.(error as Error);
    },
  });
}
