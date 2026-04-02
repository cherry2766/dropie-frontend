import GlobalLayout from "@/components/layout/global-layout";
import GuestOnlyLayout from "@/components/layout/guest-only-layout";
import MemberOnlyLayout from "@/components/layout/member-only-layout";
import EventDetailPage from "@/pages/event-detail-page";
import AdminPage from "@/pages/admin-page";
import ForgotPasswordPage from "@/pages/forgot-password-page";
import LoginPage from "@/pages/login-page";
import MainPage from "@/pages/main-page";
import MyPage from "@/pages/my-page";
import OnboardingPage from "@/pages/onboarding-page";
import OrderPage from "@/pages/order-page";
import SignUpPage from "@/pages/sign-up-page";
import { Navigate, Route, Routes } from "react-router-dom";

export default function RootRoute() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route element={<GlobalLayout />}>
        {/* 누구나 접근 가능 */}
        <Route path="/" element={<MainPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />

        {/* 로그인 안 한 사용자만 */}
        <Route element={<GuestOnlyLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* 로그인 한 사용자만 */}
        <Route element={<MemberOnlyLayout />}>
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/my" element={<MyPage />} />
        </Route>

        {/* 잘못된 경로 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}