import api from "@/lib/api";

export async function skipOnboarding(): Promise<void> {
  await api.post("/users/onboarding/skip");
}
