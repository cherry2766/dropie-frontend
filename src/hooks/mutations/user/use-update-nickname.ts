import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNickname } from "@/api/user";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";

export function useUpdateNickname() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nickname: string) => updateNickname(nickname),
    onSuccess: (data) => queryClient.setQueryData(QUERY_KEYS.me, data),
    onError: showErrorToast,
  });
}
