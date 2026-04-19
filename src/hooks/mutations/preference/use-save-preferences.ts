import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { savePreferences } from "@/api/preference";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import type { UseMutationCallback } from "@/types";

export function useSavePreferences(callbacks?: UseMutationCallback) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (tagIds: number[]) => savePreferences(tagIds),
    onSuccess: () => {
      showSuccessToast("취향 태그가 저장되었습니다.");
      callbacks?.onSuccess?.();
      navigate("/");
    },
    onError: (error) => {
      showErrorToast(error);
      callbacks?.onError?.(error as Error);
    },
  });
}
