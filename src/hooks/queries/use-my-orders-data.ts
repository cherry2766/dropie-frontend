import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/api/order";
import { QUERY_KEYS } from "@/lib/constants";

export function useMyOrdersData(page = 1, size = 10) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.list(page, size),
    queryFn: () => getMyOrders(page, size),
    staleTime: Infinity,
  });
}
