import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductStock } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";

type Variables = { productId: number; stock: number };

export function useUpdateProductStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, stock }: Variables) => updateProductStock(productId, { stock }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.products.all }),
    onError: showErrorToast,
  });
}
