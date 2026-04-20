import { useMutation } from "@tanstack/react-query";
import { deleteEvent } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";

export function useDeleteEvent() {
  return useMutation({
    mutationFn: (eventId: number) => deleteEvent(eventId),
    onError: showErrorToast,
  });
}
