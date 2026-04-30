import { useNavigate } from "react-router-dom";
import bannerImage from "@/assets/banner.png";
import { useEventsData } from "@/hooks/queries/use-events-data";
import { useEventLineupData } from "@/hooks/queries/use-event-lineup-data";
import type { EventStatus } from "@/types/event";
import { usePopularEventsData } from "@/hooks/queries/use-popular-events-data";

const STATUS_LABEL: Record<EventStatus, string> = {
  OPEN: "진행중",
  UPCOMING: "오픈 예정",
  SOLD_OUT: "품절",
  CLOSED: "마감",
  FINISHED: "종료",
};

const STATUS_STYLE: Record<EventStatus, string> = {
  OPEN: "bg-[#fff0f3] text-[#f48b94]",
  UPCOMING: "bg-blue-50 text-blue-500",
  SOLD_OUT: "bg-orange-50 text-orange-500",
  CLOSED: "bg-neutral-100 text-neutral-400",
  FINISHED: "bg-neutral-100 text-neutral-400",
};

export default function MainPage() {
  const navigate = useNavigate();
  const { data: eventsData, isLoading: eventsLoading } = useEventsData(
    1,
    6,
    "OPEN",
  );
  const { data: lineupData } = useEventLineupData();
  const { data: popularEvents = [], isLoading: popularLoading } =
    usePopularEventsData();

  return (
    <div className="space-y-6">
      {/* 배너 (이미지만) */}
      <section className="mt-[-20px] overflow-hidden rounded-[28px]">
        <img
          src={bannerImage}
          alt="드로피 메인 배너"
          className="h-[630px] w-full object-cover"
        />
      </section>

      {/* 배너 아래 텍스트 영역 */}
      <section className="space-y-3 px-1">
        <p className="text-xs font-medium tracking-[0.18em] text-pink-500 uppercase">
          limited dessert drop
        </p>

        <h1 className="text-2xl leading-tight font-extrabold text-neutral-900">
          오늘 저녁 8시,
          <br />
          인기 디저트 드롭 오픈
        </h1>

        <p className="text-sm leading-5 text-neutral-500">
          한정 수량 디저트를 빠르게 만나보세요.
          <br />
          선착순 마감으로 조기 종료될 수 있습니다.
        </p>

        {(popularLoading || popularEvents.length > 0) && (
          <section className="space-y-3 px-1">
            <h2 className="text-lg font-extrabold text-neutral-900">
              🔥 지금 뜨는 드롭 TOP10
            </h2>

            {/* 가로 스크롤 캐러셀 — 모바일에서 자연스럽고 좁은 공간을 효율적으로 사용 */}
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden">
              {popularLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-32 shrink-0 animate-pulse space-y-2"
                    >
                      <div className="aspect-[3/4] w-full rounded-2xl bg-neutral-200" />
                      <div className="h-4 w-20 rounded bg-neutral-200" />
                    </div>
                  ))
                : popularEvents.map((event, index) => (
                    <article
                      key={event.id}
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="w-32 shrink-0 cursor-pointer space-y-2"
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
                        <img
                          src={event.thumbnailImageUrl}
                          alt={event.brandName}
                          className="aspect-[3/4] w-full object-cover"
                        />
                        {/* 순위 뱃지 — 인기 TOP의 시각적 강조 */}
                        <span className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <p className="px-1 text-sm font-bold text-neutral-900">
                        {event.brandName}
                      </p>
                    </article>
                  ))}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-neutral-900">
            오픈 예정 라인업
          </h2>

          {(lineupData ?? []).map((round, index) => {
            const isHighlighted = index === 1;
            return (
              <div
                key={round.round}
                className={`flex justify-between rounded-2xl p-4 ${
                  isHighlighted
                    ? "bg-[#FFA69E]"
                    : "border border-neutral-200 bg-white"
                }`}
              >
                <div>
                  <p
                    className={`text-base font-bold ${isHighlighted ? "text-neutral-900" : ""}`}
                  >
                    {round.round}차 오픈
                  </p>
                </div>

                <div
                  className={`text-right text-sm font-medium ${isHighlighted ? "" : "text-neutral-800"}`}
                >
                  {Array.from(
                    { length: Math.ceil(round.brands.length / 2) },
                    (_, i) => (
                      <p key={i}>
                        {round.brands[i * 2]}
                        {round.brands[i * 2 + 1]
                          ? ` · ${round.brands[i * 2 + 1]}`
                          : ""}
                      </p>
                    ),
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </section>

      {/* 정보 카드 */}
      <section className="rounded-2xl bg-neutral-50 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              Today Dessert!
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              매일 오후 8시, 한정 수량으로 오픈돼요.
            </p>
          </div>

          <span className="text-xs font-medium text-pink-500">8:00 PM</span>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-x-3 gap-y-5">
        {eventsLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <article key={i} className="animate-pulse space-y-2">
                <div className="aspect-[3/4] w-full rounded-2xl bg-neutral-200" />
                <div className="space-y-2 px-1">
                  <div className="h-4 w-20 rounded bg-neutral-200" />
                  <div className="h-7 w-16 rounded bg-neutral-200" />
                  <div className="h-3 w-24 rounded bg-neutral-200" />
                </div>
              </article>
            ))
          : (eventsData?.content ?? []).map((event) => (
              <article
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="cursor-pointer space-y-2"
              >
                <div className="overflow-hidden rounded-2xl bg-neutral-100">
                  <img
                    src={event.thumbnailImageUrl}
                    alt={event.brandName}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </div>
                <div className="space-y-1.5 px-1">
                  <p className="text-sm font-bold text-neutral-900">
                    {event.brandName}
                  </p>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[event.status]}`}
                  >
                    {STATUS_LABEL[event.status]}
                  </span>
                  <p className="text-xs text-neutral-400">
                    {event.startAt.replace("T", " ").slice(0, 16)} ~
                  </p>
                </div>
              </article>
            ))}
      </section>
    </div>
  );
}
