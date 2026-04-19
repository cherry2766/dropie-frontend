import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { getTags } from "@/api/tag";

export function useTagsData() {
  return useQuery({
    queryKey: QUERY_KEYS.tags.list,
    queryFn: getTags,
    staleTime: Infinity,
  });
}
