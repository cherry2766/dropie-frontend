import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";

export function showErrorToast(error: unknown) {
  toast.error(getErrorMessage(error));
}

export function showSuccessToast(message: string) {
  toast.success(message);
}

export function showInfoToast(message: string) {
  toast.info(message);
}
