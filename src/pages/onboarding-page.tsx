import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Candy,
  Cookie,
  Milk,
  Cherry,
  Coffee,
  Leaf,
  Sandwich,
  Cake,
  Wheat,
  Sparkles,
} from "lucide-react";

const TAGS = [
  { id: "sweet", label: "달콤한", icon: Candy },
  { id: "crispy", label: "바삭한", icon: Cookie },
  { id: "creamy", label: "크리미한", icon: Milk },
  { id: "fruit", label: "과일", icon: Cherry },
  { id: "chocolate", label: "초콜릿", icon: Coffee },
  { id: "greentea", label: "녹차", icon: Leaf },
  { id: "bread", label: "빵류", icon: Sandwich },
  { id: "donut", label: "도넛류", icon: Cake },
  { id: "nutty", label: "고소한", icon: Wheat },
  { id: "seasonal", label: "시즌한정", icon: Sparkles },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  function toggleTag(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  return (
    <div className="px-4 pt-2 pb-6">
      <div className="mx-auto w-full max-w-[420px] rounded-[32px] bg-white px-8 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        {/* 로고 */}
        <div className="mb-4 text-center">
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#f48b94]">
            Droppie
          </h1>
          <p className="mt-1 text-sm text-[#9f8f95]">
            지금 인기 디저트를 확인해보세요
          </p>
        </div>

        {/* 타이틀 */}
        <div className="mb-1 text-center">
          <h2 className="text-[24px] font-bold text-[#5c4f55]">취향을 알려주세요</h2>
        </div>
        <p className="mb-6 text-center text-sm text-[#9f8f95]">
          좋아하는 디저트 태그를 골라주세요
          <br />
          맞춤 추천에 활용돼요
        </p>

        {/* 태그 목록 */}
        <div className="grid grid-cols-2 gap-3">
          {TAGS.map(({ id, label, icon: Icon }) => {
            const isSelected = selected.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleTag(id)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-[#f48b94] bg-[#fff0f3] text-[#f48b94]"
                    : "border-[#f0e8ea] bg-[#fffafb] text-[#7a6b70] hover:border-[#f4c9cf]"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${isSelected ? "text-[#f48b94]" : "text-[#c6b7bc]"}`}
                />
                #{label}
              </button>
            );
          })}
        </div>

        {/* 선택 카운트 */}
        <p className="mt-4 text-center text-xs text-[#b3a3a8]">
          {selected.length > 0
            ? `${selected.length}개 선택됨`
            : "최소 1개 이상 선택해주세요"}
        </p>

        {/* 시작하기 버튼 */}
        <button
          type="button"
          disabled={selected.length === 0}
          onClick={() => navigate("/")}
          className="mt-4 h-14 w-full rounded-2xl bg-[#f48b94] text-base font-semibold text-white shadow-[0_8px_20px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
