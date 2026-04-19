import axios from "axios";
import { getAccessToken, getLoginAction, getLogoutAction } from "@/store/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // httpOnly Cookie(Refresh Token) 자동 전송
});

// 요청마다 Authorization 헤더 자동 추가
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 동시에 여러 요청이 401을 받을 때 refresh를 한 번만 호출하기 위한 큐
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 인증이 필요 없는 엔드포인트는 refresh 시도 없이 원래 에러 그대로 반환
    const publicEndpoints = ["/auth/login", "/auth/signup", "/auth/verify-email"];
    if (publicEndpoints.some((url) => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }

    // /auth/refresh 자체가 401이면 → 쿠키 없음 or 만료 → 로그아웃
    if (originalRequest.url?.includes("/auth/refresh")) {
      getLogoutAction()();
      return Promise.reject(error);
    }

    // 이미 refresh 진행 중이면 큐에 대기
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // api 인스턴스를 쓰면 다시 이 인터셉터가 호출되므로 raw axios로 직접 호출
      const { data } = await axios.post<{ accessToken: string; role: string }>(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      getLoginAction()(data.accessToken, data.role);

      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      getLogoutAction()();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
