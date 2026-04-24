import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/user";
import { QUERY_KEYS } from "@/lib/constants";

export function useMeData(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: getMe,
    staleTime: Infinity,
    enabled: options?.enabled ?? true,
  });
}
