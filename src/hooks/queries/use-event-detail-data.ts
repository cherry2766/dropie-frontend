import { useQuery } from "@tanstack/react-query";
import { getEventDetail } from "@/api/event";
import { QUERY_KEYS } from "@/lib/constants";

export function useEventDetailData(eventId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.events.detail(eventId),
    queryFn: () => getEventDetail(eventId),
    staleTime: Infinity,
    enabled: !!eventId,
  });
}
