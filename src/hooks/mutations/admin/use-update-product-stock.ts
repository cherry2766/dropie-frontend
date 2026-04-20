import { useMutation } from "@tanstack/react-query";
import { updateProductStock } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";

type Variables = { productId: number; stock: number };

export function useUpdateProductStock() {
  return useMutation({
    mutationFn: ({ productId, stock }: Variables) => updateProductStock(productId, { stock }),
    onError: showErrorToast,
  });
}
