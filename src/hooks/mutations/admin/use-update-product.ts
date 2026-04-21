import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";
import type { UpdateProductRequest } from "@/types/admin";

type Variables = { productId: number; data: UpdateProductRequest };

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: Variables) => updateProduct(productId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.products.all }),
    onError: showErrorToast,
  });
}
