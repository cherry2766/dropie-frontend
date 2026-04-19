import { Navigate, Outlet } from "react-router";
import { useIsLoggedIn } from "@/store/auth";

export default function MemberOnlyLayout() {
  const isLoggedIn = useIsLoggedIn();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return <Outlet />;
}
