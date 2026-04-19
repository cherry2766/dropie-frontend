import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { skipOnboarding } from "@/api/user";
import { showErrorToast } from "@/lib/toast";
import type { UseMutationCallback } from "@/types";

export function useSkipOnboarding(callbacks?: UseMutationCallback) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: skipOnboarding,
    onSuccess: () => {
      callbacks?.onSuccess?.();
      navigate("/");
    },
    onError: (error) => {
      showErrorToast(error);
      callbacks?.onError?.(error as Error);
    },
  });
}
