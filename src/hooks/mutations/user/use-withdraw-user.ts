import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { withdrawUser } from "@/api/user";
import { useLogout } from "@/store/auth";
import type { UseMutationCallback } from "@/types";

export function useWithdrawUser(callbacks?: UseMutationCallback) {
  const logout = useLogout();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: withdrawUser,
    onSuccess: () => {
      logout();
      callbacks?.onSuccess?.();
      navigate("/login");
    },
    onError: (error) => {
      callbacks?.onError?.(error as Error);
    },
  });
}
