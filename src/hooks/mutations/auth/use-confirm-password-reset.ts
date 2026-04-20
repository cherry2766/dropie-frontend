import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "@/api/auth";
import { showSuccessToast } from "@/lib/toast";
import type { UseMutationCallback } from "@/types";

export function useConfirmPasswordReset(callbacks?: UseMutationCallback) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      confirmPasswordReset(token, newPassword),
    onSuccess: () => {
      showSuccessToast("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
      callbacks?.onSuccess?.();
      navigate("/login");
    },
    onError: (error) => callbacks?.onError?.(error as Error),
  });
}
