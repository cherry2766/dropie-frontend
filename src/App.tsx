import { useEffect, useState } from "react";
import RootRoute from "@/root-route";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { refreshToken } from "@/api/auth";
import { getLoginAction } from "@/store/auth";
import "./App.css";

function useAuthInit() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    refreshToken()
      .then(({ accessToken, role }) => {
        getLoginAction()(accessToken, role);
      })
      .catch(() => {
        // 쿠키 없음 or 만료 → 로그아웃 상태 유지
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, []);

  return isInitializing;
}

function App() {
  const isInitializing = useAuthInit();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100">
        <Spinner className="h-8 w-8 border-[#f4c9cf] border-t-[#f48b94]" />
      </div>
    );
  }

  return (
    <>
      <RootRoute />
      <Toaster />
    </>
  );
}

export default App;
