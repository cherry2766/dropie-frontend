import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/api/event";
import { QUERY_KEYS } from "@/lib/constants";

export function useEventsData(page = 1, size = 6) {
  return useQuery({
    queryKey: QUERY_KEYS.events.list(page, size),
    queryFn: () => getEvents(page, size),
    staleTime: Infinity,
  });
}
