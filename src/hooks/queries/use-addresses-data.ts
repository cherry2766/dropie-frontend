import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "@/api/address";
import { QUERY_KEYS } from "@/lib/constants";

export function useAddressesData() {
  return useQuery({
    queryKey: QUERY_KEYS.addresses.all,
    queryFn: getAddresses,
    staleTime: Infinity,
  });
}
