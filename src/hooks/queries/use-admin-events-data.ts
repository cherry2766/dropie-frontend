import { useQuery } from "@tanstack/react-query";
import { getAdminEvents } from "@/api/admin";
import { QUERY_KEYS } from "@/lib/constants";

export function useAdminEventsData() {
  return useQuery({
    queryKey: QUERY_KEYS.admin.events.all,
    queryFn: getAdminEvents,
    staleTime: Infinity,
  });
}
