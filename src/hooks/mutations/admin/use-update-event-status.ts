import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEventStatus } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";
import type { EventStatus } from "@/types/event";

type Variables = { eventId: number; status: EventStatus };

export function useUpdateEventStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, status }: Variables) => updateEventStatus(eventId, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.events.all }),
    onError: showErrorToast,
  });
}
