import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;

interface RequestPaymentParams {
  userId: number | undefined;
  orderNumber: string;
  orderName: string;
  amount: number;
  dbOrderId: number;
  customerEmail?: string;
  customerName: string;
}

// 신규 주문 결제 / PENDING 주문 재결제 양쪽에서 호출하기 위해 분리.
// successUrl/failUrl은 호출부 무관하게 동일해야 confirm 핸들러가 일관되게 작동함.
export async function requestTossPayment(params: RequestPaymentParams) {
  const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
  const payment = tossPayments.payment({
    // 토스 customerKey는 최소 2자 — user id가 한 자리여도 통과하도록 prefix
    customerKey: params.userId ? `user-${params.userId}` : ANONYMOUS,
  });

  await payment.requestPayment({
    method: "CARD",
    amount: { currency: "KRW", value: params.amount },
    orderId: params.orderNumber,
    orderName: params.orderName,
    successUrl: `${window.location.origin}/order/success?dbOrderId=${params.dbOrderId}`,
    failUrl: `${window.location.origin}/order/fail`,
    customerEmail: params.customerEmail,
    customerName: params.customerName,
  });
}

export function buildOrderName(items: { productName?: string; name?: string }[]): string {
  if (items.length === 0) return "주문";
  const firstName = items[0].productName ?? items[0].name ?? "주문";
  return items.length === 1 ? firstName : `${firstName} 외 ${items.length - 1}건`;
}

export function isUserCancelError(error: unknown): boolean {
  return (error as { code?: string })?.code === "USER_CANCEL";
}
