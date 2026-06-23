import { useQuery } from "@tanstack/react-query";
import { getMyRecommendations } from "@/api/recommendation";
import { QUERY_KEYS } from "@/lib/constants";

// 백엔드 60분 캐시와 맞춰 staleTime 동일하게.
// enabled로 비로그인 사용자에게는 호출하지 않도록 호출측에서 제어.
export function useMyRecommendationsData(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QUERY_KEYS.recommendations.me,
    queryFn: getMyRecommendations,
    enabled: options?.enabled ?? true,
    staleTime: 60 * 60 * 1000,
  });
}
