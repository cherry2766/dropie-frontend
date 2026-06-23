import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddress } from "@/api/address";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: number) => deleteAddress(addressId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses.all }),
    onError: showErrorToast,
  });
}
