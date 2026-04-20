import { useState } from "react";
import { Lock } from "lucide-react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useConfirmPasswordReset } from "@/hooks/mutations/auth/use-confirm-password-reset";
import { showErrorToast } from "@/lib/toast";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const { mutate: confirmReset, isPending } = useConfirmPasswordReset({
    onError: (error) => showErrorToast(error),
  });

  // 토큰 없으면 메인으로
  if (!token) return <Navigate to="/" />;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (!PASSWORD_REGEX.test(newPassword)) {
      setValidationError("비밀번호는 영문과 숫자를 포함해 8자 이상 20자 이하로 입력해 주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("비밀번호가 일치하지 않아요.");
      return;
    }

    confirmReset({ token: token!, newPassword });
  }

  return (
    <div className="px-4 pt-8 pb-10">
      <div className="mx-auto w-full max-w-[420px] rounded-[32px] bg-white px-8 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        {/* 로고 */}
        <div className="mb-4 text-center">
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#f48b94]">
            Droppie
          </h1>
          <p className="mt-1 text-sm text-[#9f8f95]">
            지금 인기 디저트를 확인해보세요
          </p>
        </div>

        <div className="mb-1 text-center">
          <div className="text-[24px] font-bold text-[#5c4f55]">새 비밀번호 설정</div>
        </div>
        <p className="mb-6 text-center text-sm text-[#9f8f95]">
          사용할 새 비밀번호를 입력해 주세요
        </p>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex h-14 items-center rounded-2xl border border-[#f4c9cf] bg-[#fffafb] px-4 focus-within:ring-2 focus-within:ring-[#f7b8c1]">
            <Lock className="mr-3 h-5 w-5 text-[#e89aa5]" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 (영문+숫자, 8~20자)"
              className="w-full bg-transparent text-[15px] text-[#5c4f55] outline-none placeholder:text-[#c6b7bc]"
            />
          </div>

          <div className="flex h-14 items-center rounded-2xl border border-[#f4c9cf] bg-[#fffafb] px-4 focus-within:ring-2 focus-within:ring-[#f7b8c1]">
            <Lock className="mr-3 h-5 w-5 text-[#e89aa5]" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 확인"
              className="w-full bg-transparent text-[15px] text-[#5c4f55] outline-none placeholder:text-[#c6b7bc]"
            />
          </div>

          {validationError && (
            <p className="text-xs text-red-400">{validationError}</p>
          )}

          <button
            type="submit"
            disabled={isPending || !newPassword || !confirmPassword}
            className="!mt-4 h-14 w-full rounded-2xl bg-[#f48b94] text-base font-semibold text-white shadow-[0_8px_20px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#8f7f85]">
          <Link to="/login" className="font-semibold text-[#f48b94] hover:text-[#eb7481]">
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
