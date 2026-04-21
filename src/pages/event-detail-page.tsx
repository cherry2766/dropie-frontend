import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Clock, Package, Minus, Plus, X } from "lucide-react";
import { useEventDetailData } from "@/hooks/queries/use-event-detail-data";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: event, isLoading } = useEventDetailData(Number(id));

  const products = event?.products.content ?? [];

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const currentProduct =
    products.find((p) => p.id === selectedProductId) ?? products[0];

  function handleSelectProduct(productId: number) {
    setSelectedProductId(productId);
    setShowSheet(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function handleConfirm() {
    setShowSheet(false);
    navigate("/orders");
  }

  const getQty = (id: number) => quantities[id] ?? 0;
  const totalCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = products.reduce((sum, p) => sum + p.price * getQty(p.id), 0);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 pb-24">
        <div className="-mx-4 -mt-5 aspect-square w-full bg-neutral-200" />
        <div className="space-y-3 px-1 pt-4">
          <div className="h-4 w-24 rounded bg-neutral-200" />
          <div className="h-6 w-48 rounded bg-neutral-200" />
          <div className="h-10 w-full rounded-2xl bg-neutral-200" />
        </div>
      </div>
    );
  }

  if (!event || !currentProduct) return null;

  return (
    <div className="relative pb-24">
      {/* 이벤트 이미지 */}
      <div className="relative -mx-4 -mt-5">
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-200">
          {event.imageUrl && (
            <img src={event.imageUrl} alt={event.brandName} className="h-full w-full object-cover" />
          )}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur"
        >
          <ChevronLeft className="h-5 w-5 text-neutral-700" />
        </button>
      </div>

      <div className="px-1 pt-4">
        {/* 브랜드 */}
        <span className="text-sm font-semibold text-neutral-500">{event.brandName}</span>

        {/* 배지 */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#fff0f3] px-2.5 py-0.5 text-xs font-semibold text-[#f48b94]">
            한정수량
          </span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
            {event.startAt.replace("T", " ").slice(0, 16)} 오픈
          </span>
        </div>

        {/* 상품명 */}
        <h1 className="mt-3 text-[18px] font-bold leading-snug text-neutral-900">
          {currentProduct.name}
        </h1>

        {/* 가격 */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-neutral-900">
            {currentProduct.price.toLocaleString()}원
          </span>
        </div>

        {/* 드롭 정보 */}
        <div className="mt-3 flex gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
          <div className="flex flex-1 items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-[#f48b94]" />
            <div>
              <p className="text-xs text-neutral-400">오픈 시간</p>
              <p className="text-sm font-semibold text-neutral-800">
                {event.startAt.replace("T", " ").slice(0, 16)}
              </p>
            </div>
          </div>
          <div className="w-px bg-neutral-200" />
          <div className="flex flex-1 items-center gap-2">
            <Package className="h-4 w-4 shrink-0 text-[#f48b94]" />
            <div>
              <p className="text-xs text-neutral-400">잔여 수량</p>
              <p className={`text-sm font-semibold ${currentProduct.stock === 0 ? "text-neutral-400" : "text-neutral-800"}`}>
                {currentProduct.stock === 0 ? "품절" : `${currentProduct.stock}개 남음`}
              </p>
            </div>
          </div>
        </div>

        {/* 상품 정보 탭 */}
        <div className="-mx-1 mt-5 border-b border-neutral-100">
          <div className="inline-block border-b-2 border-[#f48b94] px-4 pb-3">
            <span className="text-sm font-semibold text-[#f48b94]">상품 정보</span>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {currentProduct.imageUrl && (
            <div className="overflow-hidden rounded-2xl bg-neutral-100">
              <img src={currentProduct.imageUrl} alt={currentProduct.name} className="w-full object-cover" />
            </div>
          )}
          <p className="text-sm leading-relaxed text-neutral-600">{event.description}</p>
        </div>

        {/* 브랜드 다른 상품 */}
        {products.length > 1 && (
          <div className="mt-6">
            <h2 className="mb-3 text-base font-bold text-neutral-900">
              {event.brandName}의 다른 상품
            </h2>
            <div className="space-y-3">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProduct(p.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 transition-all ${
                    p.id === currentProduct.id
                      ? "border-[#f48b94] bg-[#fff0f3]"
                      : "border-neutral-100 bg-white hover:border-[#f4c9cf]"
                  }`}
                >
                  {p.imageUrl && (
                    <img src={p.imageUrl} alt={p.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                  )}
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${p.id === currentProduct.id ? "text-[#f48b94]" : "text-neutral-800"}`}>
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-neutral-900">
                      {p.price.toLocaleString()}원
                    </p>
                    {p.stock === 0 && (
                      <span className="mt-1 inline-block text-xs text-neutral-400">품절</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[540px] -translate-x-1/2 border-t border-neutral-100 bg-white px-4 py-3">
        <button
          disabled={currentProduct.stock === 0}
          onClick={() => setShowSheet(true)}
          className="h-14 w-full rounded-2xl bg-[#f48b94] text-base font-semibold text-white shadow-[0_4px_14px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {currentProduct.stock === 0 ? "품절된 상품이에요" : "주문하기"}
        </button>
      </div>

      {/* 수량 바텀시트 */}
      {showSheet && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setShowSheet(false)} />
          <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[540px] -translate-x-1/2 rounded-t-3xl bg-white px-4 pb-8 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-800">수량 선택</h3>
              <button onClick={() => setShowSheet(false)}>
                <X className="h-5 w-5 text-neutral-400" />
              </button>
            </div>

            <div className="mb-4 max-h-72 space-y-2 overflow-y-auto">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                    p.stock === 0 ? "border-neutral-100 bg-neutral-50 opacity-50" : "border-neutral-200"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{p.name}</p>
                    <p className="text-xs font-semibold text-[#f48b94]">{p.price.toLocaleString()}원</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.stock === 0 ? (
                      <span className="text-xs text-neutral-400">품절</span>
                    ) : (
                      <>
                        <button
                          onClick={() => setQuantities((prev) => ({ ...prev, [p.id]: Math.max(0, getQty(p.id) - 1) }))}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white"
                        >
                          <Minus className="h-3 w-3 text-neutral-600" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">{getQty(p.id)}</span>
                        <button
                          onClick={() => setQuantities((prev) => ({ ...prev, [p.id]: getQty(p.id) + 1 }))}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white"
                        >
                          <Plus className="h-3 w-3 text-neutral-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalCount > 0 && (
              <div className="mb-3 flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                <span className="text-sm text-neutral-500">총 {totalCount}개</span>
                <span className="text-base font-extrabold text-neutral-900">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            )}

            <button
              disabled={totalCount === 0}
              onClick={handleConfirm}
              className="h-14 w-full rounded-2xl bg-[#f48b94] text-base font-semibold text-white shadow-[0_4px_14px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              주문하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
