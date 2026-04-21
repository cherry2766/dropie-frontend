import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getProfileImagePresignedUrl, updateProfileImage } from "@/api/user";
import { showErrorToast } from "@/lib/toast";
import { QUERY_KEYS } from "@/lib/constants";

export function useUpdateProfileImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const { presignedUrl, imageUrl } = await getProfileImagePresignedUrl(
        file.name,
        file.type,
      );
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });
      return updateProfileImage(imageUrl);
    },
    onSuccess: (data) => queryClient.setQueryData(QUERY_KEYS.me, data),
    onError: showErrorToast,
  });
}
