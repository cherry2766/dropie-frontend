import { useQuery } from "@tanstack/react-query";
import { getOrderDetail } from "@/api/order";
import { QUERY_KEYS } from "@/lib/constants";

export function useOrderDetailData(orderId: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.detail(orderId ?? 0),
    queryFn: () => getOrderDetail(orderId!),
    enabled: orderId !== null,
    staleTime: Infinity,
    // 백엔드 TTL로 PENDING이 자동 취소될 수 있으므로, 상세 시트 재오픈 시 항상 최신화
    refetchOnMount: "always",
  });
}
