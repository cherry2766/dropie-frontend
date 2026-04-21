import { useState } from "react";
import { X, Search } from "lucide-react";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useAddAddress } from "@/hooks/mutations/address/use-add-address";
import { showSuccessToast } from "@/lib/toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isFirstAddress: boolean;
}

const FORM_INIT = { label: "", receiverName: "", phone: "", zipcode: "", address1: "", address2: "", isDefault: false };

export default function AddAddressModal({ isOpen, onClose, isFirstAddress }: Props) {
  const [form, setForm] = useState(FORM_INIT);
  const [showPostcode, setShowPostcode] = useState(false);
  const addAddressMutation = useAddAddress();

  if (!isOpen) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 11);
      const formatted =
        digits.length <= 3 ? digits
        : digits.length <= 7 ? `${digits.slice(0, 3)}-${digits.slice(3)}`
        : `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
      setForm((prev) => ({ ...prev, phone: formatted }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleAddressSelect(data: any) {
    setForm((prev) => ({
      ...prev,
      zipcode: data.zonecode,
      address1: data.roadAddress || data.jibunAddress,
    }));
    setShowPostcode(false);
  }

  function handleClose() {
    setForm(FORM_INIT);
    onClose();
  }

  async function handleSubmit() {
    if (!form.receiverName || !form.address1) return;
    try {
      await addAddressMutation.mutateAsync({
        receiverName: form.receiverName,
        phone: form.phone,
        zipcode: form.zipcode,
        address1: form.address1,
        address2: form.address2,
        label: form.label || "기타",
        isDefault: isFirstAddress || form.isDefault,
      });
      showSuccessToast("배송지가 추가되었습니다.");
      setForm(FORM_INIT);
      onClose();
    } catch {
      // 에러는 mutation의 onError에서 toast 처리
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[460px] rounded-3xl bg-white px-5 pt-5 pb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-800">새 배송지</h3>
          <button onClick={handleClose}>
            <X className="h-5 w-5 text-neutral-400" />
          </button>
        </div>

        <div className="space-y-2">
          <input
            name="label"
            value={form.label}
            onChange={handleChange}
            placeholder="배송지 이름 (집, 회사 등)"
            className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-[#f48b94] focus:ring-1 focus:ring-[#f48b94]"
          />
          <input
            name="receiverName"
            value={form.receiverName}
            onChange={handleChange}
            placeholder="받는 분 이름"
            className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-[#f48b94] focus:ring-1 focus:ring-[#f48b94]"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="연락처"
            className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-[#f48b94] focus:ring-1 focus:ring-[#f48b94]"
          />
          <div className="flex gap-2">
            <input
              readOnly
              value={form.zipcode}
              placeholder="우편번호"
              className="h-11 flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none placeholder:text-neutral-400"
            />
            <button
              onClick={() => setShowPostcode(true)}
              className="flex h-11 items-center gap-1 rounded-xl bg-[#f48b94] px-3 text-sm font-semibold text-white"
            >
              <Search className="h-4 w-4" />
              검색
            </button>
          </div>
          <input
            readOnly
            value={form.address1}
            placeholder="도로명 주소"
            className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none placeholder:text-neutral-400"
          />
          <input
            name="address2"
            value={form.address2}
            onChange={handleChange}
            placeholder="상세 주소"
            className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-[#f48b94] focus:ring-1 focus:ring-[#f48b94]"
          />
          {!isFirstAddress && (
            <label className="flex cursor-pointer items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
                className="h-4 w-4 accent-[#f48b94]"
              />
              <span className="text-sm text-neutral-600">기본 배송지로 설정</span>
            </label>
          )}
          <button
            onClick={handleSubmit}
            disabled={addAddressMutation.isPending}
            className="h-11 w-full rounded-xl bg-[#f48b94] text-sm font-semibold text-white transition hover:bg-[#ee7b86] disabled:opacity-60"
          >
            {addAddressMutation.isPending ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      {/* 주소 검색 팝업 */}
      {showPostcode && (
        <div className="fixed inset-0 z-60 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-[540px] rounded-t-3xl bg-white px-4 pt-5 pb-8">
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
    </div>
  );
}
