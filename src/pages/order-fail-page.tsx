import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, Info } from "lucide-react";

export default function OrderFailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 토스가 실패 시 code, message를 query param으로 붙여줌
  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const isUserCanceled = code === "PAY_PROCESS_CANCELED";

  const title = isUserCanceled ? "결제를 취소했어요" : "결제에 실패했어요";
  const description = isUserCanceled
    ? "주문 후 15분이 지나면 자동 취소돼요."
    : (message ?? "결제가 완료되지 않았어요.");

  const Icon = isUserCanceled ? Info : AlertCircle;
  const iconBg = isUserCanceled ? "bg-neutral-100" : "bg-red-50";
  const iconColor = isUserCanceled ? "text-neutral-400" : "text-red-400";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${iconBg}`}>
        <Icon className={`h-10 w-10 ${iconColor}`} />
      </div>
      <h1 className="text-xl font-extrabold text-neutral-900">{title}</h1>
      <p className="mt-2 text-sm text-neutral-500">{description}</p>
      <div className="mt-8 flex w-full max-w-[320px] flex-col gap-3">
        <button
          onClick={() => navigate("/my")}
          className="h-12 w-full rounded-2xl bg-[#f48b94] text-sm font-semibold text-white shadow-[0_4px_14px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86]"
        >
          주문 내역 보기
        </button>
        <button
          onClick={() => navigate("/")}
          className="h-12 w-full rounded-2xl border border-neutral-200 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
