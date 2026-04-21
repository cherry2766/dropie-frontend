import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/api/order";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";
import type { CreateOrderRequest } from "@/types/order";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all }),
    onError: showErrorToast,
  });
}
