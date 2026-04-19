import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useIsLoggedIn, useRole, useShowOnboarding } from "@/store/auth";

export default function GuestOnlyLayout() {
  const isLoggedIn = useIsLoggedIn();
  const role = useRole();
  const showOnboarding = useShowOnboarding();
  const navigate = useNavigate();

  // 로그인 후 이동 경로를 여기서만 결정 — mutation에서 navigate를 호출하지 않음
  // 이유: mutation에서 login() + navigate()를 따로 호출하면 zustand 업데이트가 먼저
  //       반영되어 이 effect가 navigate("/")로 덮어쓰는 race condition 발생
  useEffect(() => {
    if (!isLoggedIn) return;
    if (role === "ADMIN") navigate("/admin", { replace: true });
    else if (showOnboarding) navigate("/onboarding", { replace: true });
    else navigate("/", { replace: true });
  }, [isLoggedIn, role, showOnboarding, navigate]);

  if (isLoggedIn) return null;

  return <Outlet />;
}
