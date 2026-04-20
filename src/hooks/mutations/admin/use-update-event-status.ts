import { useMutation } from "@tanstack/react-query";
import { updateEventStatus } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import type { EventStatus } from "@/types/event";

type Variables = { eventId: number; status: EventStatus };

export function useUpdateEventStatus() {
  return useMutation({
    mutationFn: ({ eventId, status }: Variables) => updateEventStatus(eventId, { status }),
    onError: showErrorToast,
  });
}
