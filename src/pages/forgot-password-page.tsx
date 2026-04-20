import { useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useRequestPasswordReset } from "@/hooks/mutations/auth/use-request-password-reset";
import { showErrorToast } from "@/lib/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const { mutate: requestReset, isPending } = useRequestPasswordReset({
    onSuccess: () => setSent(true),
    onError: (error) => showErrorToast(error),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    requestReset(email);
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

        {/* 타이틀 */}
        <div className="mb-1 text-center">
          <div className="text-[24px] font-bold text-[#5c4f55]">비밀번호 찾기</div>
        </div>

        {sent ? (
          <>
            <p className="mt-4 text-center text-sm text-[#9f8f95]">
              <span className="font-semibold text-[#f48b94]">{email}</span>로<br />
              재설정 링크를 보내드렸어요.<br />
              메일함을 확인해 주세요.
            </p>
            <button
              type="button"
              onClick={() => { setSent(false); setEmail(""); }}
              className="mt-6 h-14 w-full rounded-2xl border border-[#f4c9cf] bg-white text-base font-semibold text-[#f48b94] transition hover:bg-[#fff0f3]"
            >
              다시 전송하기
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="mb-4 text-center text-sm text-[#9f8f95]">
              가입한 이메일로 재설정 링크를 보내드려요
            </p>

            <div className="mb-2">
              <div className="flex h-14 items-center rounded-2xl border border-[#f4c9cf] bg-[#fffafb] px-4 focus-within:ring-2 focus-within:ring-[#f7b8c1]">
                <Mail className="mr-3 h-5 w-5 text-[#e89aa5]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일"
                  className="w-full bg-transparent text-[15px] text-[#5c4f55] outline-none placeholder:text-[#c6b7bc]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || !email}
              className="mt-4 h-14 w-full rounded-2xl bg-[#f48b94] text-base font-semibold text-white shadow-[0_8px_20px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "전송 중..." : "재설정 링크 전송"}
            </button>
          </form>
        )}

        {/* 로그인 이동 */}
        <p className="mt-5 text-center text-sm text-[#8f7f85]">
          비밀번호가 기억나셨나요?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#f48b94] hover:text-[#eb7481]"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
