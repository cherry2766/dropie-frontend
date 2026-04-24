import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PackageCheck, AlertCircle, Loader2 } from "lucide-react";
import { useConfirmPayment } from "@/hooks/mutations/order/use-confirm-payment";
import { getErrorMessage } from "@/lib/error";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const confirmMutation = useConfirmPayment();

  // 토스가 paymentKey, orderId(=orderNumber), amount를 붙여줌
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");
  // 우리가 successUrl에 붙여둔 DB orderId (confirm API의 path param)
  const dbOrderId = searchParams.get("dbOrderId");

  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (hasRequestedRef.current) return;
    if (!paymentKey || !amount || !dbOrderId) return;

    hasRequestedRef.current = true;
    confirmMutation.mutate({
      orderId: Number(dbOrderId),
      data: { paymentKey, amount: Number(amount) },
    });
  }, [paymentKey, amount, dbOrderId, confirmMutation]);

  if (!paymentKey || !amount || !dbOrderId) {
    return (
      <StateView
        icon={<AlertCircle className="h-10 w-10 text-neutral-400" />}
        title="잘못된 접근이에요"
        description="결제 정보가 전달되지 않았어요."
        primaryLabel="홈으로"
        onPrimary={() => navigate("/")}
      />
    );
  }

  if (confirmMutation.isPending || confirmMutation.isIdle) {
    return (
      <StateView
        icon={<Loader2 className="h-10 w-10 animate-spin text-[#f48b94]" />}
        title="결제를 확인하고 있어요"
        description="잠시만 기다려 주세요."
      />
    );
  }

  if (confirmMutation.isError) {
    return (
      <StateView
        icon={<AlertCircle className="h-10 w-10 text-red-400" />}
        title="결제 확인에 실패했어요"
        description={getErrorMessage(confirmMutation.error)}
        primaryLabel="주문 내역 보기"
        onPrimary={() => navigate("/my")}
        secondaryLabel="홈으로"
        onSecondary={() => navigate("/")}
      />
    );
  }

  const data = confirmMutation.data!;
  return (
    <StateView
      icon={<PackageCheck className="h-10 w-10 text-[#f48b94]" />}
      title="결제가 완료됐어요!"
      description={
        <>
          주문번호 <span className="font-semibold text-neutral-700">{data.orderNumber}</span>
          <br />
          <span className="text-neutral-400">
            {data.method} · {data.amount.toLocaleString()}원
          </span>
        </>
      }
      primaryLabel="주문 내역 보기"
      onPrimary={() => navigate("/my")}
      secondaryLabel="홈으로"
      onSecondary={() => navigate("/")}
    />
  );
}

function StateView({
  icon,
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f3]">
        {icon}
      </div>
      <h1 className="text-xl font-extrabold text-neutral-900">{title}</h1>
      <p className="mt-2 text-sm text-neutral-500">{description}</p>
      {(primaryLabel || secondaryLabel) && (
        <div className="mt-8 flex w-full max-w-[320px] flex-col gap-3">
          {primaryLabel && (
            <button
              onClick={onPrimary}
              className="h-12 w-full rounded-2xl bg-[#f48b94] text-sm font-semibold text-white shadow-[0_4px_14px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86]"
            >
              {primaryLabel}
            </button>
          )}
          {secondaryLabel && (
            <button
              onClick={onSecondary}
              className="h-12 w-full rounded-2xl border border-neutral-200 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
