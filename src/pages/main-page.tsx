import { useNavigate } from "react-router-dom";
import bannerImage from "@/assets/banner.png";
import { useEventsData } from "@/hooks/queries/use-events-data";
import type { EventStatus } from "@/types/event";

const STATUS_LABEL: Record<EventStatus, string> = {
  OPEN: "진행중",
  UPCOMING: "오픈 예정",
  CLOSED: "마감",
  FINISHED: "종료",
};

const STATUS_STYLE: Record<EventStatus, string> = {
  OPEN: "bg-[#fff0f3] text-[#f48b94]",
  UPCOMING: "bg-blue-50 text-blue-500",
  CLOSED: "bg-neutral-100 text-neutral-400",
  FINISHED: "bg-neutral-100 text-neutral-400",
};

export default function MainPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useEventsData();
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

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-neutral-900">
            오픈 예정 라인업
          </h2>

          {/* 1차 */}
          <div className="flex justify-between rounded-2xl border border-neutral-200 bg-white p-4">
            <div>
              <p className="text-base font-bold">1차 오픈</p>
              <p className="mt-1 text-xs text-neutral-400">
                3/13 오전 11시 ~<br />
                3/16 오전 10시 59분
              </p>
            </div>

            <div className="text-right text-sm font-medium text-neutral-800">
              쑤니맘베이커리 · 장인한과
              <br />
              니드쿠키 · 코코로나인
            </div>
          </div>

          {/* 2차 (강조) */}
          <div className="flex justify-between rounded-2xl bg-[#FFA69E] p-4">
            <div>
              <p className="text-base font-bold text-neutral-900">2차 오픈</p>
              <p className="mt-1 text-xs text-neutral-700">
                3/16 오전 11시 ~<br />
                3/19 오전 10시 59분
              </p>
            </div>

            <div className="text-right text-sm font-medium">
              콩지니빵 · 니드스윗
              <br />
              여름방학 · 위로상점
            </div>
          </div>

          {/* 3차 */}
          <div className="flex justify-between rounded-2xl border border-neutral-200 bg-white p-4">
            <div>
              <p className="text-base font-bold">3차 오픈</p>
              <p className="mt-1 text-xs text-neutral-400">
                3/19 오전 11시 ~<br />
                3/21 자정까지
              </p>
            </div>

            <div className="text-right text-sm font-medium text-neutral-800">
              구움양과점 · 벨리스
              <br />
              각이당 · 윤쓰코티
            </div>
          </div>
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
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <article key={i} className="space-y-2 animate-pulse">
                <div className="aspect-[3/4] w-full rounded-2xl bg-neutral-200" />
                <div className="space-y-2 px-1">
                  <div className="h-4 w-20 rounded bg-neutral-200" />
                  <div className="h-7 w-16 rounded bg-neutral-200" />
                  <div className="h-3 w-24 rounded bg-neutral-200" />
                </div>
              </article>
            ))
          : (data?.content ?? []).map((event) => (
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
                  <p className="text-sm font-bold text-neutral-900">{event.brandName}</p>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[event.status]}`}>
                    {STATUS_LABEL[event.status]}
                  </span>
                  <p className="text-xs text-neutral-400">
                    {event.startAt.replace("T", " ").slice(0, 16)} ~
                  </p>
                </div>
              </article>
            ))
        }
      </section>
    </div>
  );
}
