import { useMutation } from "@tanstack/react-query";
import { updateProduct } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import type { UpdateProductRequest } from "@/types/admin";

type Variables = { productId: number; data: UpdateProductRequest };

export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({ productId, data }: Variables) => updateProduct(productId, data),
    onError: showErrorToast,
  });
}
