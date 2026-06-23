import { useQuery } from "@tanstack/react-query";
import { searchAdminTags } from "@/api/tag";
import { QUERY_KEYS } from "@/lib/constants";

// 어드민 태그 자동완성 쿼리.
// keyword가 빈 문자열이면 호출 자체를 막아 (enabled=false) 불필요한 트래픽 방지.
export function useAdminTagsSearchData(keyword: string) {
  const trimmed = keyword.trim();
  return useQuery({
    queryKey: QUERY_KEYS.admin.tags.search(trimmed),
    queryFn: () => searchAdminTags(trimmed),
    enabled: trimmed.length > 0,
    staleTime: 60 * 1000,
  });
}
