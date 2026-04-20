import { useState } from "react";
import { getPresignedUrl, uploadToS3 } from "@/api/admin";
import { showErrorToast } from "@/lib/toast";

type UploadState = "idle" | "uploading" | "done" | "error";

export function useImageUpload() {
  const [state, setState] = useState<UploadState>("idle");

  async function upload(file: File): Promise<string | null> {
    setState("uploading");
    try {
      const { presignedUrl, imageUrl } = await getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
      });
      await uploadToS3(presignedUrl, file);
      setState("done");
      return imageUrl;
    } catch (err) {
      setState("error");
      showErrorToast(err);
      return null;
    }
  }

  function reset() {
    setState("idle");
  }

  return {
    state,
    isUploading: state === "uploading",
    isError: state === "error",
    upload,
    reset,
  };
}
