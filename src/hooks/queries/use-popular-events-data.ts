import { getPopularEvents } from "@/api/event";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

// 인기 이벤트 TOP10 조회 훅
// - 백엔드가 ZUNIONSTORE 결과에 60초 캐시를 두고 있으므로
//   클라이언트 staleTime도 60초로 맞춰 서버 캐시 TTL과 일치시킴
// - refetchOnWindowFocus는 기본값(true)으로 두어 탭 복귀 시 신선도 확보
export function usePopularEventsData() {
  return useQuery({
    queryKey: QUERY_KEYS.events.popular,
    queryFn: getPopularEvents,
    staleTime: 60 * 1000,
  });
}
