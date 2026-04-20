import { useMutation } from "@tanstack/react-query";
import { deleteProduct } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";

export function useDeleteProduct() {
  return useMutation({
    mutationFn: (productId: number) => deleteProduct(productId),
    onError: showErrorToast,
  });
}
