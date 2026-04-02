import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
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

        <p className="mb-4 text-center text-sm text-[#9f8f95]">
          가입한 이메일로 재설정 링크를 보내드려요
        </p>

        {/* 이메일 */}
        <div className="mb-2">
          <div className="flex h-14 items-center rounded-2xl border border-[#f4c9cf] bg-[#fffafb] px-4 focus-within:ring-2 focus-within:ring-[#f7b8c1]">
            <Mail className="mr-3 h-5 w-5 text-[#e89aa5]" />
            <input
              type="email"
              placeholder="이메일"
              className="w-full bg-transparent text-[15px] text-[#5c4f55] outline-none placeholder:text-[#c6b7bc]"
            />
          </div>
        </div>

        {/* 전송 버튼 */}
        <button
          type="button"
          className="mt-4 h-14 w-full rounded-2xl bg-[#f48b94] text-base font-semibold text-white shadow-[0_8px_20px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86]"
        >
          재설정 링크 전송
        </button>

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
