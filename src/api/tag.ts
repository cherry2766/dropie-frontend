import api from "@/lib/api";
import type { TagEntity } from "@/types";

export async function getTags(): Promise<TagEntity[]> {
  const res = await api.get<TagEntity[]>("/tags");
  return res.data;
}

// 어드민 태그 자동완성. keyword 빈 값/누락은 백엔드가 [] 반환
export async function searchAdminTags(keyword: string): Promise<TagEntity[]> {
  const res = await api.get<TagEntity[]>("/admin/tags", {
    params: { keyword },
  });
  return res.data;
}
