import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEvent } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: number) => deleteEvent(eventId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.events.all }),
    onError: showErrorToast,
  });
}
