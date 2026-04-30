import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createStompClient } from "@/lib/ws";
import { QUERY_KEYS } from "@/lib/constants";
import type { StockUpdateMessage, EventDetailEntity } from "@/types/event";

/**
 * 이벤트 stock 실시간 구독 훅
 * - /topic/events/{id}/stock 구독해서 useEventDetailData 캐시를 직접 갱신
 * - 캐시 갱신 방식이라 페이지 재진입 시에도 마지막 stock 유지
 */
export function useStockSubscription(eventId: number | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!eventId || Number.isNaN(eventId)) return;

    const client = createStompClient();

    client.onConnect = () => {
      // subscribe는 반드시 onConnect 안에서 호출
      client.subscribe(`/topic/events/${eventId}/stock`, (msg) => {
        const update = JSON.parse(msg.body) as StockUpdateMessage;

        // 해당 productId의 stock만 교체
        queryClient.setQueryData<EventDetailEntity>(
          QUERY_KEYS.events.detail(eventId),
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              products: {
                ...prev.products,
                content: prev.products.content.map((p) =>
                  p.id === update.productId ? { ...p, stock: update.stock } : p,
                ),
              },
            };
          },
        );
      });
    };

    client.onStompError = (frame) => {
      console.error("[STOMP] error:", frame.headers["message"]);
    };

    client.activate();

    return () => {
      // cleanup은 sync여야 해서 await 안 함 (내부적으로 안전 종료)
      client.deactivate();
    };
  }, [eventId, queryClient]);
}