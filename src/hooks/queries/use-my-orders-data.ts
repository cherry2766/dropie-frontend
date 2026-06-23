import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/api/order";
import { QUERY_KEYS } from "@/lib/constants";

export function useMyOrdersData(page = 1, size = 10) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.list(page, size),
    queryFn: () => getMyOrders(page, size),
    staleTime: Infinity,
    // 백엔드 TTL로 PENDING이 자동 취소될 수 있으므로, 마이페이지 재진입 시 항상 최신화
    refetchOnMount: "always",
  });
}
