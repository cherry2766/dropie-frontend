import api from "@/lib/api";

export async function savePreferences(tagIds: number[]): Promise<void> {
  await api.post("/users/me/preferences", { tagIds });
}
