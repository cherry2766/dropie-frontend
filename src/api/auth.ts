import axios from "axios";
import api from "@/lib/api";

type AuthResponse = { accessToken: string; role: string };
type LoginResponse = AuthResponse & { showOnboarding: boolean };

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/login", { email, password });
  return res.data;
}

// 백엔드에서 토큰 없이 { message, email }만 반환
// 이메일 인증 완료 후 로그인해야 서비스 이용 가능
export async function signUp(
  email: string,
  password: string,
  nickname: string,
): Promise<{ message: string; email: string }> {
  const res = await api.post<{ message: string; email: string }>("/auth/signup", {
    email,
    password,
    nickname,
  });
  return res.data;
}

// httpOnly Cookie를 직접 전송해야 하므로 api 인스턴스가 아닌 raw axios 사용
// api 인스턴스를 쓰면 401 인터셉터가 다시 refresh를 호출하는 무한루프 발생
export async function refreshToken(): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>(
    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );
  return res.data;
}

export async function logoutApi(): Promise<void> {
  await api.post("/auth/logout");
}

export async function resendVerification(email: string): Promise<void> {
  await api.post("/auth/resend-verification", { email });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await api.post("/auth/password-reset/request", { email });
}

export async function confirmPasswordReset(token: string, newPassword: string): Promise<void> {
  await api.post("/auth/password-reset/confirm", { token, newPassword });
}
