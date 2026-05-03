import api from "@/lib/api";
import type { RecommendationEntity } from "@/types/recommendation";

export async function getMyRecommendations(): Promise<RecommendationEntity[]> {
  const res = await api.get<RecommendationEntity[]>("/users/me/recommendations");
  return res.data;
}
