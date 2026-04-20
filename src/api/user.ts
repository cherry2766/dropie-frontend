import api from "@/lib/api";

export async function skipOnboarding(): Promise<void> {
  await api.post("/users/onboarding/skip");
}

export async function withdrawUser(): Promise<void> {
  await api.delete("/users/me");
}
