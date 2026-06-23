import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useMyRecommendationsData } from "@/hooks/queries/use-my-recommendations-data";
import { useIsLoggedIn } from "@/store/auth";

// 사용자 메인 상단에 노출되는 "당신을 위한 추천" 섹션.
// - 비로그인 사용자에게는 아예 호출하지 않음 (enabled)
// - 응답이 빈 배열이면 섹션 자체를 숨김 (스펙 권장)
export default function RecommendationSection() {
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  const { data: items = [], isLoading } = useMyRecommendationsData({
    enabled: isLoggedIn,
  });

  if (!isLoggedIn) return null;

  if (isLoading) {
    return (
      <section className="space-y-3 px-1">
        <h2 className="flex items-center gap-1.5 text-lg font-extrabold text-neutral-900">
          <Sparkles className="h-4 w-4 text-[#f48b94]" />
          당신을 위한 추천
        </h2>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="w-64 shrink-0 animate-pulse space-y-2">
              <div className="aspect-[4/3] w-full rounded-2xl bg-neutral-200" />
              <div className="h-4 w-32 rounded bg-neutral-200" />
              <div className="h-3 w-48 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="space-y-3 border-t border-neutral-100 px-1 pt-6">
      <h2 className="flex items-center gap-1.5 text-lg font-extrabold text-neutral-900">
        <Sparkles className="h-4 w-4 text-[#f48b94]" />
        당신을 위한 추천
      </h2>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <article
            key={item.eventId}
            onClick={() => navigate(`/events/${item.eventId}`)}
            className="flex w-64 shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="overflow-hidden bg-neutral-100">
              <img
                src={item.thumbnailImageUrl}
                alt={item.brandName}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            {/* flex-1 + flex-col — 부모 캐러셀의 items-stretch로 카드 높이가 통일된 뒤,
                가격 줄을 mt-auto로 카드 하단에 고정해 카드 간 정렬을 맞춤 */}
            <div className="flex flex-1 flex-col space-y-2 p-3">
              <p className="text-sm font-bold text-neutral-900">{item.brandName}</p>

              {/* AI 생성 문구임을 어필 — 인용 스타일 + ✨ 아이콘 */}
              {/* flex-1 — 카드 높이가 통일된 상태에서 분홍 박스가 남는 세로 공간을 모두 차지 → 카드 간 박스 높이 동일 */}
              <p className="flex flex-1 gap-1 rounded-lg bg-[#fff0f3] px-2 py-1.5 text-xs leading-snug text-neutral-700">
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-[#f48b94]" />
                <span>{item.message}</span>
              </p>

              <div className="mt-auto flex items-center justify-between pt-1">
                <span className="truncate text-xs text-neutral-500">{item.productName}</span>
                <span className="ml-2 shrink-0 text-xs font-semibold text-neutral-800">
                  {item.productPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
