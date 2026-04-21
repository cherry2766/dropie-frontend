import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddress } from "@/api/address";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";
import type { AddAddressRequest } from "@/types/address";

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddAddressRequest) => addAddress(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses.all }),
    onError: showErrorToast,
  });
}
