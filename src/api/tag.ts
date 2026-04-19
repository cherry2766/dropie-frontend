import api from "@/lib/api";
import type { TagEntity } from "@/types";

export async function getTags(): Promise<TagEntity[]> {
  const res = await api.get<TagEntity[]>("/tags");
  return res.data;
}
