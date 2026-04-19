import { Navigate, Outlet } from "react-router";
import { useIsLoggedIn, useRole } from "@/store/auth";

export default function AdminOnlyLayout() {
  const isLoggedIn = useIsLoggedIn();
  const role = useRole();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/" replace />;

  return <Outlet />;
}
