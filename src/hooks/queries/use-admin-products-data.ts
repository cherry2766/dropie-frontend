import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "@/api/admin";
import { QUERY_KEYS } from "@/lib/constants";

export function useAdminProductsData() {
  return useQuery({
    queryKey: QUERY_KEYS.admin.products.all,
    queryFn: getAdminProducts,
    staleTime: Infinity,
  });
}
