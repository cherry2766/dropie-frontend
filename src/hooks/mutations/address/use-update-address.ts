import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddress } from "@/api/address";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";
import type { UpdateAddressRequest } from "@/types/address";

type Variables = { addressId: number; data: UpdateAddressRequest };

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, data }: Variables) => updateAddress(addressId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses.all }),
    onError: showErrorToast,
  });
}
