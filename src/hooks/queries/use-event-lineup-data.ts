import { useQuery } from "@tanstack/react-query";
import { getEventLineup } from "@/api/event";
import { QUERY_KEYS } from "@/lib/constants";

export function useEventLineupData() {
  return useQuery({
    queryKey: QUERY_KEYS.events.lineup,
    queryFn: getEventLineup,
    staleTime: Infinity,
  });
}
