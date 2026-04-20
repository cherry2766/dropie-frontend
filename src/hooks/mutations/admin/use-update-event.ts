import { useMutation } from "@tanstack/react-query";
import { updateEvent } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import type { UpdateEventRequest } from "@/types/admin";

type Variables = { eventId: number; data: UpdateEventRequest };

export function useUpdateEvent() {
  return useMutation({
    mutationFn: ({ eventId, data }: Variables) => updateEvent(eventId, data),
    onError: showErrorToast,
  });
}
