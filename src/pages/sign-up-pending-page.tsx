import { useLocation, Navigate, Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useResendVerification } from "@/hooks/mutations/auth/use-resend-verification";
import { Spinner } from "@/components/ui/spinner";

export default function SignUpPendingPage() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;
  const { mutate: resend, isPending } = useResendVerification();

  if (!email) return <Navigate to="/sign-up" replace />;

  return (
    <div className="px-4 pt-8 pb-10">
      <div className="mx-auto w-full max-w-[420px] rounded-[32px] bg-white px-8 py-10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] text-center">
        <div className="mb-4 text-center">
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#f48b94]">
            Droppie
          </h1>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f3]">
            <Mail className="h-8 w-8 text-[#f48b94]" />
          </div>
        </div>

        <h2 className="mb-2 text-[22px] font-bold text-[#5c4f55]">인증 메일을 확인해주세요</h2>
        <p className="mb-1 text-sm text-[#9f8f95]">아래 주소로 인증 메일을 발송했습니다.</p>
        <p className="mb-6 text-sm font-semibold text-[#f48b94]">{email}</p>
        <p className="mb-8 text-xs text-[#b3a3a8]">
          메일함을 확인하고 인증 링크를 클릭하면 가입이 완료됩니다.
          <br />
          링크는 30분간 유효합니다.
        </p>

        <button
          type="button"
          onClick={() => resend(email)}
          disabled={isPending}
          className="h-12 w-full rounded-2xl border border-[#f4c9cf] bg-[#fffafb] text-sm font-semibold text-[#f48b94] transition hover:bg-[#fff0f3] disabled:opacity-60"
        >
          {isPending ? (
            <Spinner className="h-4 w-4 border-[#f4c9cf] border-t-[#f48b94]" />
          ) : (
            "인증 메일 재발송"
          )}
        </button>

        <p className="mt-5 text-sm text-[#8f7f85]">
          이미 인증하셨나요?{" "}
          <Link to="/login" className="font-semibold text-[#f48b94] hover:text-[#eb7481]">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
