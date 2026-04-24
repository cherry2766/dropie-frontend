import { useQuery } from "@tanstack/react-query";
import { getOrderDetail } from "@/api/order";
import { QUERY_KEYS } from "@/lib/constants";

export function useOrderDetailData(orderId: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.detail(orderId ?? 0),
    queryFn: () => getOrderDetail(orderId!),
    enabled: orderId !== null,
    staleTime: Infinity,
  });
}
