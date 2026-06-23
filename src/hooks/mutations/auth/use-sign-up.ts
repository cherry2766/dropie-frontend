import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/api/auth";
import { showErrorToast } from "@/lib/toast";
import type { UseMutationCallback } from "@/types";

export function useSignUp(callbacks?: UseMutationCallback) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      email,
      password,
      nickname,
    }: {
      email: string;
      password: string;
      nickname: string;
    }) => signUp(email, password, nickname),
    onSuccess: ({ email }) => {
      callbacks?.onSuccess?.();
      navigate("/sign-up-pending", { state: { email } });
    },
    onError: (error) => {
      showErrorToast(error);
      callbacks?.onError?.(error as Error);
    },
  });
}
