import GlobalLayout from "@/components/layout/global-layout";
import GuestOnlyLayout from "@/components/layout/guest-only-layout";
import MemberOnlyLayout from "@/components/layout/member-only-layout";
import AdminOnlyLayout from "@/components/layout/admin-only-layout";
import EventDetailPage from "@/pages/event-detail-page";
import AdminPage from "@/pages/admin-page";
import ForgotPasswordPage from "@/pages/forgot-password-page";
import LoginPage from "@/pages/login-page";
import MainPage from "@/pages/main-page";
import MyPage from "@/pages/my-page";
import OnboardingPage from "@/pages/onboarding-page";
import OrderPage from "@/pages/order-page";
import OrderSuccessPage from "@/pages/order-success-page";
import OrderFailPage from "@/pages/order-fail-page";
import SignUpPage from "@/pages/sign-up-page";
import SignUpPendingPage from "@/pages/sign-up-pending-page";
import VerifyEmailPage from "@/pages/verify-email-page";
import ResetPasswordPage from "@/pages/reset-password-page";
import { Navigate, Route, Routes } from "react-router-dom";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<AdminOnlyLayout />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route element={<GlobalLayout />}>
        {/* 누구나 접근 가능 */}
        <Route path="/" element={<MainPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        {/* 백엔드가 이메일 인증 후 ?success=true/false 로 리다이렉트하는 경로 */}
        <Route path="/signup-complete" element={<VerifyEmailPage />} />
        {/* 비밀번호 재설정은 로그인 상태와 무관하게 접근 가능 (마이페이지에서도 진입) */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* 로그인 안 한 사용자만 */}
        <Route element={<GuestOnlyLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-up-pending" element={<SignUpPendingPage />} />
        </Route>

        {/* 로그인 한 사용자만 */}
        <Route element={<MemberOnlyLayout />}>
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/order/success" element={<OrderSuccessPage />} />
          <Route path="/order/fail" element={<OrderFailPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* 잘못된 경로 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
