import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, LogOut, Plus, X, Search, Package } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import DaumPostcodeEmbed from "react-daum-postcode";

type Tab = "orders" | "address";

const ORDER_HISTORY = [
  { id: 1, date: "2026.04.02", name: "봄 딸기 디저트 박스 외 1건", price: 91000, status: "배송완료" },
  { id: 2, date: "2026.03.20", name: "말차 크림 롤케이크", price: 32000, status: "배송완료" },
  { id: 3, date: "2026.03.10", name: "얼그레이 마들렌 세트", price: 18000, status: "배송완료" },
];

const INITIAL_ADDRESSES = [
  { id: 1, label: "집", name: "김체리", phone: "010-1234-5678", zipcode: "06234", address1: "서울 강남구 테헤란로 123", address2: "101동 202호", isDefault: true },
];

export default function MyPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [tab, setTab] = useState<Tab>("orders");
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [showPostcode, setShowPostcode] = useState(false);
  const [form, setForm] = useState({ label: "", name: "", phone: "", zipcode: "", address1: "", address2: "" });

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleAddressSelect(data: any) {
    setForm((prev) => ({ ...prev, zipcode: data.zonecode, address1: data.roadAddress || data.jibunAddress }));
    setShowPostcode(false);
  }

  function handleAddAddress() {
    if (!form.name || !form.address1) return;
    setAddresses((prev) => [
      ...prev,
      { id: Date.now(), label: form.label || "기타", name: form.name, phone: form.phone, zipcode: form.zipcode, address1: form.address1, address2: form.address2, isDefault: prev.length === 0 },
    ]);
    setForm({ label: "", name: "", phone: "", zipcode: "", address1: "", address2: "" });
    setShowForm(false);
  }

  return (
    <div className="pb-6">
      {/* 프로필 */}
      <div className="mb-5 flex items-center justify-between rounded-2xl bg-[#fff0f3] px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f48b94]">
            <User className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-neutral-900">cherry님</p>
            <p className="text-sm text-neutral-500">cherry@dropie.kr</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600">
          <LogOut className="h-3.5 w-3.5" />
          로그아웃
        </button>
      </div>

      {/* 탭 */}
      <div className="-mx-4 mb-4 flex border-b border-neutral-100">
        <button
          onClick={() => setTab("orders")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-colors ${tab === "orders" ? "border-b-2 border-[#f48b94] text-[#f48b94]" : "text-neutral-400"}`}
        >
          <Package className="h-4 w-4" />
          주문 내역
        </button>
        <button
          onClick={() => setTab("address")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-colors ${tab === "address" ? "border-b-2 border-[#f48b94] text-[#f48b94]" : "text-neutral-400"}`}
        >
          <MapPin className="h-4 w-4" />
          배송지 관리
        </button>
      </div>

      {/* 주문 내역 */}
      {tab === "orders" && (
        <div className="space-y-2">
          {ORDER_HISTORY.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-2xl border border-neutral-100 px-4 py-3">
              <div>
                <p className="text-xs text-neutral-400">{order.date}</p>
                <p className="mt-0.5 text-sm font-medium text-neutral-800">{order.name}</p>
                <p className="mt-0.5 text-sm font-bold text-neutral-900">{order.price.toLocaleString()}원</p>
              </div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                {order.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 배송지 관리 */}
      {tab === "address" && (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-2xl border border-neutral-100 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#fff0f3] px-2 py-0.5 text-xs font-semibold text-[#f48b94]">{addr.label}</span>
                  {addr.isDefault && <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">기본</span>}
                </div>
                <button className="text-xs text-neutral-400 hover:text-neutral-600">삭제</button>
              </div>
              <p className="mt-2 text-sm font-semibold text-neutral-800">{addr.name} · {addr.phone}</p>
              <p className="mt-0.5 text-sm text-neutral-600">{addr.address1}</p>
              {addr.address2 && <p className="text-sm text-neutral-500">{addr.address2}</p>}
              <p className="text-xs text-neutral-400">{addr.zipcode}</p>
            </div>
          ))}

          {/* 추가 버튼 */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 py-4 text-sm font-medium text-neutral-500 transition hover:border-[#f48b94] hover:text-[#f48b94]"
            >
              <Plus className="h-4 w-4" />
              배송지 추가
            </button>
          )}

          {/* 추가 폼 */}
          {showForm && (
            <div className="rounded-2xl border border-[#f4c9cf] bg-[#fffafb] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-800">새 배송지</h3>
                <button onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4 text-neutral-400" />
                </button>
              </div>
              <div className="space-y-2">
                <input name="label" value={form.label} onChange={handleChange} placeholder="배송지 이름 (집, 회사 등)" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400" />
                <input name="name" value={form.name} onChange={handleChange} placeholder="받는 분 이름" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="연락처" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400" />
                <div className="flex gap-2">
                  <input readOnly value={form.zipcode} placeholder="우편번호" className="h-11 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400" />
                  <button onClick={() => setShowPostcode(true)} className="flex h-11 items-center gap-1 rounded-xl bg-[#f48b94] px-3 text-sm font-semibold text-white">
                    <Search className="h-4 w-4" />
                    검색
                  </button>
                </div>
                <input readOnly value={form.address1} placeholder="도로명 주소" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400" />
                <input name="address2" value={form.address2} onChange={handleChange} placeholder="상세 주소" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400" />
                <button onClick={handleAddAddress} className="h-11 w-full rounded-xl bg-[#f48b94] text-sm font-semibold text-white transition hover:bg-[#ee7b86]">
                  저장
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 주소 검색 팝업 */}
      {showPostcode && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-[540px] rounded-t-3xl bg-white px-4 pb-8 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-800">주소 검색</h3>
              <button onClick={() => setShowPostcode(false)} className="text-sm text-neutral-400">닫기</button>
            </div>
            <DaumPostcodeEmbed onComplete={handleAddressSelect} />
          </div>
        </div>
      )}
    </div>
  );
}
