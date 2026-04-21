import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/api/order";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => cancelOrder(orderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all }),
    onError: showErrorToast,
  });
}
