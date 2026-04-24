import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/api/order";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";
import type { CreateOrderRequest } from "@/types/order";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
    // 성공/실패 모두 재고가 바뀔 수 있으므로 이벤트 캐시도 함께 무효화
    // (실패 케이스: OUT_OF_STOCK — 다른 사용자가 먼저 구매해서 재고가 줄어든 상태)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
    onError: showErrorToast,
  });
}
