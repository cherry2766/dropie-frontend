import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";
import type { CreateProductRequest } from "@/types/admin";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.products.all }),
    onError: showErrorToast,
  });
}
