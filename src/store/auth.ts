import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

// 스토어 내부 타입 (이 파일 밖에서 사용하지 않음)
type LoggedOutState = {
  isLoggedIn: false;
  accessToken: null;
  role: null;
  showOnboarding: false;
};

type LoggedInState = {
  isLoggedIn: true;
  accessToken: string;
  role: string;
  showOnboarding: boolean;
};

type State = LoggedOutState | LoggedInState;

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  role: null,
  showOnboarding: false,
} as State;

const useAuthStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        // showOnboarding: 로그인 폼 제출 시 백엔드 응답값, refresh token 복원 시엔 false
        login: (accessToken: string, role: string, showOnboarding = false) =>
          set({ isLoggedIn: true, accessToken, role, showOnboarding } as LoggedInState),
        logout: () =>
          set({
            isLoggedIn: false,
            accessToken: null,
            role: null,
            showOnboarding: false,
          } as LoggedOutState),
      },
    })),
    { name: "authStore" },
  ),
);

// 비React 컨텍스트용 유틸 (axios 인터셉터에서 사용)
export const getAccessToken = () => useAuthStore.getState().accessToken;
export const getLoginAction = () => useAuthStore.getState().actions.login;
export const getLogoutAction = () => useAuthStore.getState().actions.logout;

// 셀렉터 훅 (컴포넌트에서 사용)
export const useIsLoggedIn = () => useAuthStore((s) => s.isLoggedIn);
export const useRole = () => useAuthStore((s) => s.role);
export const useShowOnboarding = () => useAuthStore((s) => s.showOnboarding);
export const useLogin = () => useAuthStore((s) => s.actions.login);
export const useLogout = () => useAuthStore((s) => s.actions.logout);
