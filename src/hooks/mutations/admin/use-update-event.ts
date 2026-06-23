import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEvent } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";
import type { UpdateEventRequest } from "@/types/admin";

type Variables = { eventId: number; data: UpdateEventRequest };

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, data }: Variables) => updateEvent(eventId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.events.all }),
    onError: showErrorToast,
  });
}
