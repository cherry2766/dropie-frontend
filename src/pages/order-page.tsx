import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Search, MapPin, ChevronRight } from "lucide-react";
import DaumPostcodeEmbed from "react-daum-postcode";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useAddressesData } from "@/hooks/queries/use-addresses-data";
import { useCreateOrder } from "@/hooks/mutations/order/use-create-order";
import { useMeData } from "@/hooks/queries/use-me-data";
import { showErrorToast } from "@/lib/toast";
import type { AddressEntity } from "@/types/address";

type OrderItem = { id: number; name: string; imageUrl: string; price: number; quantity: number };

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;

export default function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderItems: OrderItem[] = location.state?.items ?? [];
  const { data: addresses = [] } = useAddressesData();
  const { data: me } = useMeData();

  const createOrderMutation = useCreateOrder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPostcode, setShowPostcode] = useState(false);
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    zipcode: "",
    address1: "",
    address2: "",
    memo: "",
  });

  function applyAddress(addr: AddressEntity) {
    setSelectedAddressId(addr.id);
    setForm((prev) => ({
      ...prev,
      name: addr.receiverName,
      phone: addr.phone,
      zipcode: addr.zipcode,
      address1: addr.address1,
      address2: addr.address2,
    }));
  }

  // 주소 목록 로드 시 기본 배송지로 폼 초기화 — 사용자가 이후 직접 수정할 수 있어야 하므로
  // derived state가 아니라 editable state로 관리, 초기 동기화는 effect에서 한 번만 수행
  useEffect(() => {
    if (addresses.length === 0) return;
    const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    applyAddress(defaultAddr);
  }, [addresses]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleAddressSelect(data: any) {
    const base = data.roadAddress || data.jibunAddress;
    const address1 = data.buildingName ? `${base} (${data.buildingName})` : base;
    setForm((prev) => ({ ...prev, zipcode: data.zonecode, address1 }));
    setShowPostcode(false);
  }

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedAddressId(null); // 직접 수정 시 선택 해제
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleOrder() {
    if (!form.name || !form.address1 || orderItems.length === 0) return;

    setIsProcessing(true);
    try {
      // 1. 주문 생성 (재고 선점, status = PENDING)
      const order = await createOrderMutation.mutateAsync({
        receiverName: form.name,
        phone: form.phone,
        zipcode: form.zipcode,
        address1: form.address1,
        address2: form.address2,
        items: orderItems.map((item) => ({ productId: item.id, quantity: item.quantity })),
      });

      // 2. 토스 결제창 오픈 — 성공 시 successUrl로 redirect
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({
        // 토스 customerKey는 최소 2자 — user id가 한 자리여도 통과하도록 prefix
        customerKey: me?.id ? `user-${me.id}` : ANONYMOUS,
      });

      const orderName =
        orderItems.length === 1
          ? orderItems[0].name
          : `${orderItems[0].name} 외 ${orderItems.length - 1}건`;

      // successUrl에 우리 DB orderId를 붙여서 성공 페이지가 confirm API를 호출할 수 있게 함
      // (토스가 붙여주는 orderId는 orderNumber라서 DB id가 별도로 필요)
      const successUrl = `${window.location.origin}/order/success?dbOrderId=${order.orderId}`;
      const failUrl = `${window.location.origin}/order/fail`;

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: totalPrice },
        orderId: order.orderNumber,
        orderName,
        successUrl,
        failUrl,
        customerEmail: me?.email,
        customerName: form.name,
      });
    } catch (error) {
      // 토스 SDK 에러는 AxiosError가 아니라 원본을 그대로 콘솔에 남겨야 원인 파악 가능
      console.error("[OrderPage] 결제 요청 실패", error);
      showErrorToast(error);
      setIsProcessing(false);
    }
  }

  return (
    <div className="pb-28">
      {/* 헤더 */}
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200"
        >
          <ChevronLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <h1 className="text-lg font-bold text-neutral-900">주문 확인</h1>
      </div>

      {/* 주문 상품 */}
      <section className="mb-4 rounded-2xl border border-neutral-100 p-4">
        <h2 className="mb-3 text-sm font-bold text-neutral-800">주문 상품</h2>
        <div className="space-y-3">
          {orderItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.imageUrl
                ? <img src={item.imageUrl} alt={item.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                : <div className="h-14 w-14 shrink-0 rounded-xl bg-neutral-100" />
              }
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800">{item.name}</p>
                <p className="mt-0.5 text-xs text-neutral-400">수량 {item.quantity}개</p>
              </div>
              <span className="text-sm font-bold text-neutral-900">
                {(item.price * item.quantity).toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 배송지 정보 */}
      <section className="mb-4 rounded-2xl border border-neutral-100 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-800">배송지 정보</h2>
          {addresses.length > 0 && (
            <button
              onClick={() => setShowAddressSheet(true)}
              className="flex items-center gap-0.5 text-xs font-medium text-[#f48b94]"
            >
              <MapPin className="h-3.5 w-3.5" />
              배송지 변경
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex h-12 items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="받는 분 이름"
              className="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
          </div>
          <div className="flex h-12 items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3">
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="연락처 (010-0000-0000)"
              className="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex h-12 flex-1 items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3">
              <input
                readOnly
                value={form.zipcode}
                placeholder="우편번호"
                className="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPostcode(true)}
              className="flex h-12 items-center gap-1.5 rounded-xl bg-[#f48b94] px-4 text-sm font-semibold text-white transition hover:bg-[#ee7b86]"
            >
              <Search className="h-4 w-4" />
              검색
            </button>
          </div>
          <div className="flex h-12 items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3">
            <input
              readOnly
              value={form.address1}
              placeholder="도로명 주소"
              className="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
          </div>
          <div className="flex h-12 items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3">
            <input
              name="address2"
              value={form.address2}
              onChange={handleChange}
              placeholder="상세 주소 (동/호수 등)"
              className="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
          </div>
          <div className="flex h-12 items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3">
            <input
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="배송 메모 (선택)"
              className="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* 주소 검색 팝업 */}
        {showPostcode && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
            <div className="w-full max-w-[540px] rounded-t-3xl bg-white px-4 pb-8 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-800">주소 검색</h3>
                <button onClick={() => setShowPostcode(false)} className="text-sm text-neutral-400">
                  닫기
                </button>
              </div>
              <DaumPostcodeEmbed onComplete={handleAddressSelect} />
            </div>
          </div>
        )}
      </section>

      {/* 결제 금액 */}
      <section className="mb-4 rounded-2xl border border-neutral-100 p-4">
        <h2 className="mb-3 text-sm font-bold text-neutral-800">결제 금액</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-neutral-500">
            <span>상품 금액</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-neutral-100 pt-3">
            <span className="text-base font-bold text-neutral-900">최종 결제 금액</span>
            <span className="text-base font-extrabold text-[#f48b94]">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>
      </section>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[540px] -translate-x-1/2 border-t border-neutral-100 bg-white px-4 py-3">
        <button
          onClick={handleOrder}
          disabled={isProcessing}
          className="h-14 w-full rounded-2xl bg-[#f48b94] text-base font-semibold text-white shadow-[0_4px_14px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86] disabled:opacity-60"
        >
          {isProcessing ? "처리 중..." : `${totalPrice.toLocaleString()}원 결제하기`}
        </button>
      </div>

      {/* 배송지 선택 바텀시트 */}
      {showAddressSheet && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setShowAddressSheet(false)} />
          <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[540px] -translate-x-1/2 rounded-t-3xl bg-white px-4 pb-8 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-800">배송지 선택</h3>
              <button onClick={() => setShowAddressSheet(false)} className="text-sm text-neutral-400">
                닫기
              </button>
            </div>
            <div className="max-h-[60vh] space-y-2 overflow-y-auto">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => { applyAddress(addr); setShowAddressSheet(false); }}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedAddressId === addr.id
                      ? "border-[#f48b94] bg-[#fff0f3]"
                      : "border-neutral-100 bg-white hover:border-[#f4c9cf]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#fff0f3] px-2 py-0.5 text-xs font-semibold text-[#f48b94]">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                        기본
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-neutral-800">
                    {addr.receiverName} · {addr.phone}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-600">{addr.address1}</p>
                  {addr.address2 && <p className="text-sm text-neutral-500">{addr.address2}</p>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
