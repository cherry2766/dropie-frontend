import { X, Loader2 } from "lucide-react";
import { useOrderDetailData } from "@/hooks/queries/use-order-detail-data";
import { useCancelOrder } from "@/hooks/mutations/order/use-cancel-order";
import type { OrderStatus } from "@/types/order";

interface Props {
  orderId: number | null;
  onClose: () => void;
}

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "결제 대기",
  PAID: "결제 완료",
  CANCELED: "취소됨",
};

const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  PAID: "bg-emerald-50 text-emerald-600",
  CANCELED: "bg-neutral-100 text-neutral-400",
};

export default function OrderDetailSheet({ orderId, onClose }: Props) {
  const isOpen = orderId !== null;
  const { data: order, isLoading } = useOrderDetailData(orderId);
  const cancelOrderMutation = useCancelOrder();

  if (!isOpen) return null;

  async function handleCancel() {
    if (!order) return;
    await cancelOrderMutation.mutateAsync(order.orderId);
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[540px] -translate-x-1/2 rounded-t-3xl bg-white">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-base font-bold text-neutral-800">주문 상세</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 pb-8">
          {isLoading || !order ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-[#f48b94]" />
            </div>
          ) : (
            <div className="space-y-5">
              {/* 주문번호 + 상태 */}
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-[#f48b94]">
                    {order.items[0]?.brandName}
                  </p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ORDER_STATUS_STYLE[order.status]}`}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">{order.orderNumber}</p>
              </div>

              {/* 주문 상품 */}
              <section>
                <h4 className="mb-2 text-xs font-bold text-neutral-500">주문 상품</h4>
                <div className="space-y-3 rounded-2xl border border-neutral-100 p-3">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 shrink-0 rounded-xl bg-neutral-100" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-800">{item.productName}</p>
                        <p className="mt-0.5 text-xs text-neutral-400">수량 {item.quantity}개</p>
                      </div>
                      <span className="text-sm font-bold text-neutral-900">
                        {item.orderPrice.toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 배송지 */}
              <section>
                <h4 className="mb-2 text-xs font-bold text-neutral-500">배송지</h4>
                <div className="rounded-2xl border border-neutral-100 p-3">
                  <p className="text-sm font-semibold text-neutral-800">
                    {order.receiverName} · {order.phone}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-600">{order.address}</p>
                </div>
              </section>

              {/* 결제 금액 */}
              <section>
                <h4 className="mb-2 text-xs font-bold text-neutral-500">결제 금액</h4>
                <div className="flex items-center justify-between rounded-2xl border border-neutral-100 p-3">
                  <span className="text-sm text-neutral-600">총 결제 금액</span>
                  <span className="text-base font-extrabold text-[#f48b94]">
                    {order.totalPrice.toLocaleString()}원
                  </span>
                </div>
              </section>

              {/* 주문 취소 (PENDING만) */}
              {order.status === "PENDING" && (
                <button
                  onClick={handleCancel}
                  disabled={cancelOrderMutation.isPending}
                  className="h-12 w-full rounded-2xl border border-neutral-200 text-sm font-semibold text-neutral-600 transition hover:border-red-200 hover:text-red-500 disabled:opacity-50"
                >
                  {cancelOrderMutation.isPending ? "취소 처리 중..." : "주문 취소"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
