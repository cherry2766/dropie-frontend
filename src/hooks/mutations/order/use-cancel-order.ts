import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/api/order";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => cancelOrder(orderId),
    // 주문 취소 성공 시 재고가 복원되므로 이벤트 캐시도 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
    onError: showErrorToast,
  });
}
