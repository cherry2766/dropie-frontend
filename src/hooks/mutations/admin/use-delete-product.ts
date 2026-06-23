import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => deleteProduct(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.products.all }),
    onError: showErrorToast,
  });
}
