import { useMutation } from "@tanstack/react-query";
import { createEvent } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import type { CreateEventRequest } from "@/types/admin";

export function useCreateEvent() {
  return useMutation({
    mutationFn: (data: CreateEventRequest) => createEvent(data),
    onError: showErrorToast,
  });
}
