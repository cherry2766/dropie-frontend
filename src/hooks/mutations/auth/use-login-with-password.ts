import { useMutation } from "@tanstack/react-query";
import { loginWithPassword } from "@/api/auth";
import { useLogin } from "@/store/auth";
import { showErrorToast } from "@/lib/toast";
import type { UseMutationCallback } from "@/types";

export function useLoginWithPassword(callbacks?: UseMutationCallback) {
  const login = useLogin();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginWithPassword(email, password),
    onSuccess: ({ accessToken, role, showOnboarding }) => {
      // navigate는 GuestOnlyLayout에서 단일 처리 — 여기서 호출하면 race condition 발생
      login(accessToken, role, showOnboarding);
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      showErrorToast(error);
      callbacks?.onError?.(error as Error);
    },
  });
}
