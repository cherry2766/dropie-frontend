import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";
import type { CreateEventRequest } from "@/types/admin";

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventRequest) => createEvent(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.events.all }),
    onError: showErrorToast,
  });
}
