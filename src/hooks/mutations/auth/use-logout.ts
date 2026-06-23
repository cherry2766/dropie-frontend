import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "@/api/auth";
import { useLogout } from "@/store/auth";
import type { UseMutationCallback } from "@/types";

export function useLogoutMutation(callbacks?: UseMutationCallback) {
  const logout = useLogout();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logout();
      // 이전 사용자의 캐시(me, 주문 내역 등)가 다음 로그인에 노출되지 않도록 전체 비우기
      queryClient.clear();
      callbacks?.onSuccess?.();
      navigate("/");
    },
    onError: (error) => {
      // API 실패해도 로컬 상태는 반드시 로그아웃 처리
      logout();
      queryClient.clear();
      navigate("/");
      callbacks?.onError?.(error as Error);
    },
  });
}
