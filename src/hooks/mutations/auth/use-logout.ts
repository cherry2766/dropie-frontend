import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "@/api/auth";
import { useLogout } from "@/store/auth";
import type { UseMutationCallback } from "@/types";

export function useLogoutMutation(callbacks?: UseMutationCallback) {
  const logout = useLogout();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logout();
      callbacks?.onSuccess?.();
      navigate("/");
    },
    onError: (error) => {
      // API 실패해도 로컬 상태는 반드시 로그아웃 처리
      logout();
      navigate("/");
      callbacks?.onError?.(error as Error);
    },
  });
}
