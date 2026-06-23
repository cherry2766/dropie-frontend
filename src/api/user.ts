import api from "@/lib/api";
import type { UserEntity } from "@/types/user";

export async function getMe(): Promise<UserEntity> {
  const res = await api.get<UserEntity>("/users/me");
  return res.data;
}

export async function updateNickname(nickname: string): Promise<UserEntity> {
  const res = await api.patch<UserEntity>("/users/me", { nickname });
  return res.data;
}

export async function getProfileImagePresignedUrl(
  fileName: string,
  contentType: string,
): Promise<{ presignedUrl: string; imageUrl: string }> {
  const res = await api.post<{ presignedUrl: string; imageUrl: string }>(
    "/users/me/profile-image/presigned-url",
    { fileName, contentType },
  );
  return res.data;
}

export async function updateProfileImage(profileImageUrl: string): Promise<UserEntity> {
  const res = await api.patch<UserEntity>("/users/me/profile-image", { profileImageUrl });
  return res.data;
}

export async function skipOnboarding(): Promise<void> {
  await api.post("/users/onboarding/skip");
}

export async function withdrawUser(): Promise<void> {
  await api.delete("/users/me");
}
