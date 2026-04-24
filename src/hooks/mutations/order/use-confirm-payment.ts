import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmPayment } from "@/api/order";
import { QUERY_KEYS } from "@/lib/constants";
import type { PaymentConfirmRequest } from "@/types/order";

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: PaymentConfirmRequest }) =>
      confirmPayment(orderId, data),
    // 결제 실패 시 백엔드가 재고를 복원하므로 이벤트 캐시도 함께 무효화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
}
