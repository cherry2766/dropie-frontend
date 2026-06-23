import { useSearchParams, Link } from "react-router-dom";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success") === "true";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto w-full max-w-[420px] rounded-[32px] bg-white px-8 py-12 text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        {success ? (
          <>
            <p className="text-lg font-semibold text-[#f48b94]">이메일 인증 완료!</p>
            <p className="mt-2 text-sm text-[#9f8f95]">이제 로그인하실 수 있습니다.</p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-2xl bg-[#f48b94] px-8 py-3 text-sm font-semibold text-white hover:bg-[#ee7b86]"
            >
              로그인하러 가기
            </Link>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-red-400">인증에 실패했습니다.</p>
            <p className="mt-2 text-sm text-[#9f8f95]">
              유효하지 않거나 만료된 인증 링크입니다.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-2xl bg-[#f48b94] px-8 py-3 text-sm font-semibold text-white hover:bg-[#ee7b86]"
            >
              홈으로 돌아가기
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
