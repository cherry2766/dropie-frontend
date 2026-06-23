import { useState } from "react";
import { toast } from "sonner";
import { useTagsData } from "@/hooks/queries/use-tags-data";
import { useSavePreferences } from "@/hooks/mutations/preference/use-save-preferences";
import { useSkipOnboarding } from "@/hooks/mutations/user/use-skip-onboarding";
import { Spinner } from "@/components/ui/spinner";

export default function OnboardingPage() {
  const [selected, setSelected] = useState<number[]>([]);

  const { data: tags, isLoading: tagsLoading } = useTagsData();
  const { mutate: savePreferences, isPending } = useSavePreferences();
  const { mutate: skip, isPending: isSkipping } = useSkipOnboarding();

  function toggleTag(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  function handleSubmit() {
    if (selected.length === 0) {
      toast.error("최소 1개 이상 선택해주세요.");
      return;
    }
    savePreferences(selected);
  }

  return (
    <div className="px-4 pt-2 pb-6">
      <div className="mx-auto w-full max-w-[420px] rounded-[32px] bg-white px-8 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        {/* 로고 */}
        <div className="mb-4 text-center">
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#f48b94]">
            Droppie
          </h1>
          <p className="mt-1 text-sm text-[#9f8f95]">지금 인기 디저트를 확인해보세요</p>
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
        {tagsLoading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-6 w-6 border-[#f4c9cf] border-t-[#f48b94]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {(tags ?? []).map(({ id, name }) => {
              const isSelected = selected.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleTag(id)}
                  className={`flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                    isSelected
                      ? "border-[#f48b94] bg-[#fff0f3] text-[#f48b94]"
                      : "border-[#f0e8ea] bg-[#fffafb] text-[#7a6b70] hover:border-[#f4c9cf]"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        )}

        {/* 선택 카운트 */}
        <p className="mt-4 text-center text-xs text-[#b3a3a8]">
          {selected.length > 0 ? `${selected.length}개 선택됨` : "최소 1개 이상 선택해주세요"}
        </p>

        {/* 시작하기 버튼 */}
        <button
          type="button"
          disabled={isPending || tagsLoading}
          onClick={handleSubmit}
          className="mt-4 h-14 w-full rounded-2xl bg-[#f48b94] text-base font-semibold text-white shadow-[0_8px_20px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? (
            <Spinner className="h-4 w-4 border-white/40 border-t-white" />
          ) : (
            "시작하기"
          )}
        </button>

        {/* 건너뛰기 */}
        <button
          type="button"
          disabled={isPending || isSkipping}
          onClick={() => skip()}
          className="mt-3 w-full text-sm text-[#b3a3a8] hover:text-[#9f8f95] disabled:pointer-events-none"
        >
          나중에 할게요
        </button>
      </div>
    </div>
  );
}
