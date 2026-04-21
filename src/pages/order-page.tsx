import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, PackageCheck, Search, MapPin, ChevronRight } from "lucide-react";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useAddressesData } from "@/hooks/queries/use-addresses-data";
import type { AddressEntity } from "@/types/address";

const ORDER_ITEMS = [
  { id: 1, name: "봄 딸기 디저트 박스 (4구 선택)", price: 28000, quantity: 2 },
  { id: 3, name: "말차 크림 롤케이크", price: 32000, quantity: 1 },
];

const SHIPPING_FEE = 3000;

export default function OrderPage() {
  const navigate = useNavigate();
  const { data: addresses = [] } = useAddressesData();

  const [done, setDone] = useState(false);
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

  // 주소 목록 로드 시 기본 배송지로 폼 초기화
  useEffect(() => {
    if (addresses.length === 0) return;
    const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
    applyAddress(defaultAddr);
  }, [addresses]);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleAddressSelect(data: any) {
    const base = data.roadAddress || data.jibunAddress;
    const address1 = data.buildingName ? `${base} (${data.buildingName})` : base;
    setForm((prev) => ({ ...prev, zipcode: data.zonecode, address1 }));
    setShowPostcode(false);
  }

  const totalPrice = ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalPrice = totalPrice + SHIPPING_FEE;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedAddressId(null); // 직접 수정 시 선택 해제
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  if (done) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f3]">
          <PackageCheck className="h-10 w-10 text-[#f48b94]" />
        </div>
        <h1 className="text-xl font-extrabold text-neutral-900">주문이 완료됐어요!</h1>
        <p className="mt-2 text-sm text-neutral-500">
          주문번호 <span className="font-semibold text-neutral-700">#DP-20260402-001</span>
        </p>
        <p className="mt-1 text-sm text-neutral-400">
          주문 내역은 마이페이지에서 확인할 수 있어요
        </p>
        <div className="mt-8 flex w-full max-w-[320px] flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="h-12 w-full rounded-2xl bg-[#f48b94] text-sm font-semibold text-white shadow-[0_4px_14px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86]"
          >
            홈으로
          </button>
          <button
            onClick={() => navigate("/my")}
            className="h-12 w-full rounded-2xl border border-neutral-200 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
          >
            주문 내역 보기
          </button>
        </div>
      </div>
    );
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
          {ORDER_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 rounded-xl bg-neutral-100" />
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
          <div className="flex justify-between text-sm text-neutral-500">
            <span>배송비</span>
            <span>{SHIPPING_FEE.toLocaleString()}원</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-neutral-100 pt-3">
            <span className="text-base font-bold text-neutral-900">최종 결제 금액</span>
            <span className="text-base font-extrabold text-[#f48b94]">
              {finalPrice.toLocaleString()}원
            </span>
          </div>
        </div>
      </section>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[540px] -translate-x-1/2 border-t border-neutral-100 bg-white px-4 py-3">
        <button
          onClick={() => setDone(true)}
          className="h-14 w-full rounded-2xl bg-[#f48b94] text-base font-semibold text-white shadow-[0_4px_14px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86]"
        >
          {finalPrice.toLocaleString()}원 결제하기
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
