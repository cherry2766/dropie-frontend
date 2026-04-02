import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, Package, Minus, Plus, X } from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "봄 딸기 디저트 박스 (4구 선택)",
    price: 28000,
    originalPrice: 35000,
    discount: 20,
    stock: 25,
    openTime: "오늘 오후 8:00",
    options: [
      { id: 1, name: "딸기 생크림", stock: 12 },
      { id: 2, name: "초코 가나슈", stock: 5 },
      { id: 3, name: "말차 팥앙금", stock: 0 },
      { id: 4, name: "얼그레이 크림", stock: 8 },
    ],
  },
  {
    id: 2,
    name: "초코 가나슈 타르트",
    price: 22000,
    originalPrice: 26000,
    discount: 15,
    stock: 10,
    openTime: "오늘 오후 8:00",
    options: [
      { id: 1, name: "다크 초코", stock: 6 },
      { id: 2, name: "밀크 초코", stock: 4 },
    ],
  },
  {
    id: 3,
    name: "말차 크림 롤케이크",
    price: 32000,
    originalPrice: 38000,
    discount: 16,
    stock: 8,
    openTime: "오늘 오후 8:00",
    options: [
      { id: 1, name: "말차 팥", stock: 5 },
      { id: 2, name: "말차 딸기", stock: 3 },
    ],
  },
  {
    id: 4,
    name: "얼그레이 마들렌 세트",
    price: 18000,
    originalPrice: 22000,
    discount: 18,
    stock: 20,
    options: [
      { id: 1, name: "6구 세트", stock: 12 },
      { id: 2, name: "12구 세트", stock: 8 },
    ],
    openTime: "오늘 오후 8:00",
  },
  {
    id: 5,
    name: "시즌 한정 쿠키 박스",
    price: 25000,
    originalPrice: 30000,
    discount: 17,
    stock: 0,
    openTime: "오늘 오후 8:00",
    options: [
      { id: 1, name: "버터 쿠키", stock: 0 },
      { id: 2, name: "초코칩 쿠키", stock: 0 },
    ],
  },
];

const IMAGES = [1, 2, 3, 4];

export default function EventDetailPage() {
  const navigate = useNavigate();
  const [currentProductId, setCurrentProductId] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [showSheet, setShowSheet] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>(
    Object.fromEntries(PRODUCTS.map((p) => [p.id, 0]))
  );

  const product = PRODUCTS.find((p) => p.id === currentProductId)!;

  function handleSelectProduct(id: number) {
    setCurrentProductId(id);
    setCurrentImage(0);
    setShowSheet(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function handleConfirm() {
    setShowSheet(false);
    navigate("/orders");
  }

  return (
    <div className="relative pb-24">
      {/* 이미지 캐러셀 */}
      <div className="relative -mx-4 -mt-5">
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-200">
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-sm text-neutral-400">상품 이미지 {currentImage + 1}</span>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur"
        >
          <ChevronLeft className="h-5 w-5 text-neutral-700" />
        </button>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentImage ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-1 pt-4">
        {/* 브랜드 */}
        <span className="text-sm font-semibold text-neutral-500">쑤니맘베이커리</span>

        {/* 배지 */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#fff0f3] px-2.5 py-0.5 text-xs font-semibold text-[#f48b94]">
            한정수량
          </span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
            오늘 저녁 8시 오픈
          </span>
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
            시즌한정
          </span>
        </div>

        {/* 상품명 */}
        <h1 className="mt-3 text-[18px] font-bold leading-snug text-neutral-900">
          {product.name}
        </h1>

        {/* 가격 */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-neutral-900">
            {product.price.toLocaleString()}원
          </span>
          <span className="text-sm text-neutral-400 line-through">
            {product.originalPrice.toLocaleString()}원
          </span>
          <span className="text-sm font-bold text-[#f48b94]">{product.discount}%</span>
        </div>

        {/* 드롭 정보 */}
        <div className="mt-3 flex gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
          <div className="flex flex-1 items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-[#f48b94]" />
            <div>
              <p className="text-xs text-neutral-400">오픈 시간</p>
              <p className="text-sm font-semibold text-neutral-800">{product.openTime}</p>
            </div>
          </div>
          <div className="w-px bg-neutral-200" />
          <div className="flex flex-1 items-center gap-2">
            <Package className="h-4 w-4 shrink-0 text-[#f48b94]" />
            <div>
              <p className="text-xs text-neutral-400">잔여 수량</p>
              <p className={`text-sm font-semibold ${product.stock === 0 ? "text-neutral-400" : "text-neutral-800"}`}>
                {product.stock === 0 ? "품절" : `${product.stock}개 남음`}
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

        <div className="mt-4">
          <h2 className="sr-only">상품 정보</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            쑤니맘베이커리의 시그니처 봄 디저트 박스예요. 매일 새벽 직접 구운 신선한 재료로만
            만들어지며, 당일 출고 원칙을 지키고 있어요. 설탕 함량을 낮추고 천연 과일 본연의
            단맛을 살린 건강한 디저트를 만나보세요.
          </p>

          <div className="mt-3 space-y-2">
            {[
              "✔ 매일 새벽 당일 제조, 신선한 재료만 사용",
              "✔ 인공 색소·방부제 무첨가",
              "✔ 냉장 보관, 수령 후 3일 이내 섭취 권장",
              "✔ 선물 포장 기본 제공",
            ].map((item) => (
              <p key={item} className="text-sm text-neutral-500">{item}</p>
            ))}
          </div>
        </div>

        {/* 상품 이미지 */}
        <div className="mt-5 space-y-3">
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              상품 상세 이미지 1
            </div>
          </div>
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              상품 상세 이미지 2
            </div>
          </div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100">
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              상품 상세 이미지 3
            </div>
          </div>
        </div>

        {/* 상품정보제공공시 */}
        <div className="mt-4 rounded-2xl border border-neutral-100 p-4">
          <h3 className="mb-3 text-sm font-bold text-neutral-800">상품정보제공공시</h3>
          {[
            ["원산지", "국내산"],
            ["제조자", "쑤니맘베이커리"],
            ["주의사항", "냉장 보관"],
            ["유통기한", "제조일로부터 3일"],
          ].map(([label, value]) => (
            <div key={label} className="flex border-t border-neutral-100 py-2.5 text-sm">
              <span className="w-24 shrink-0 text-neutral-400">{label}</span>
              <span className="text-neutral-700">{value}</span>
            </div>
          ))}
        </div>

        {/* 브랜드 다른 상품 */}
        <div className="mt-6">
          <h2 className="mb-3 text-base font-bold text-neutral-900">
            쑤니맘베이커리의 다른 상품
          </h2>
          <div className="space-y-3">
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectProduct(p.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 transition-all ${
                  p.id === currentProductId
                    ? "border-[#f48b94] bg-[#fff0f3]"
                    : "border-neutral-100 bg-white hover:border-[#f4c9cf]"
                }`}
              >
                <div className="h-16 w-16 shrink-0 rounded-xl bg-neutral-200" />
                <div className="text-left">
                  <p className={`text-sm font-semibold ${p.id === currentProductId ? "text-[#f48b94]" : "text-neutral-800"}`}>
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
      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[540px] -translate-x-1/2 border-t border-neutral-100 bg-white px-4 py-3">
        <button
          disabled={product.stock === 0}
          onClick={() => setShowSheet(true)}
          className="h-14 w-full rounded-2xl bg-[#f48b94] text-base font-semibold text-white shadow-[0_4px_14px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? "품절된 상품이에요" : "주문하기"}
        </button>
      </div>

      {/* 수량 바텀시트 */}
      {showSheet && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setShowSheet(false)}
          />
          <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[540px] -translate-x-1/2 rounded-t-3xl bg-white px-4 pb-8 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-800">수량 선택</h3>
              <button onClick={() => setShowSheet(false)}>
                <X className="h-5 w-5 text-neutral-400" />
              </button>
            </div>

            <div className="mb-4 max-h-72 space-y-2 overflow-y-auto">
              {PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                    p.stock === 0 ? "border-neutral-100 bg-neutral-50 opacity-50" : "border-neutral-200"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{p.name}</p>
                    <p className="text-xs text-[#f48b94] font-semibold">{p.price.toLocaleString()}원</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.stock === 0 ? (
                      <span className="text-xs text-neutral-400">품절</span>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setQuantities((prev) => ({
                              ...prev,
                              [p.id]: Math.max(0, (prev[p.id] ?? 0) - 1),
                            }))
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white"
                        >
                          <Minus className="h-3 w-3 text-neutral-600" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">
                          {quantities[p.id] ?? 0}
                        </span>
                        <button
                          onClick={() =>
                            setQuantities((prev) => ({
                              ...prev,
                              [p.id]: (prev[p.id] ?? 0) + 1,
                            }))
                          }
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

            {/* 합계 */}
            {Object.values(quantities).some((q) => q > 0) && (
              <div className="mb-3 flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                <span className="text-sm text-neutral-500">
                  총 {Object.values(quantities).reduce((a, b) => a + b, 0)}개
                </span>
                <span className="text-base font-extrabold text-neutral-900">
                  {PRODUCTS.reduce(
                    (sum, p) => sum + p.price * (quantities[p.id] ?? 0),
                    0
                  ).toLocaleString()}원
                </span>
              </div>
            )}

            <button
              disabled={!Object.values(quantities).some((q) => q > 0)}
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
