import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";
import type { CreateProductRequest } from "@/types/admin";

export function useCreateProduct() {
  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onError: showErrorToast,
  });
}
