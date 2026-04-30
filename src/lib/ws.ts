import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// STOMP Client 팩토리
//
// 왜 함수로 빼는가?
//   - 환경변수(VITE_WS_URL)와 재연결 정책을 한 곳에서 관리
//   - 페이지마다 같은 설정을 복붙하지 않게 하기 위함
//   - 테스트 시 mock 주입이 쉬워짐
//
// 한 페이지에 한 connection을 띄우는 단순 모델.
// 추후 여러 페이지/도메인에서 동시 구독이 필요해지면 싱글톤으로 승격
export function createStompClient(): Client {
  return new Client({
    // SockJS는 WebSocket 미지원 환경(구형 프록시 등)에서 long-polling으로 자동 폴백
    webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL),

    // 연결이 끊기면 3초 후 자동 재연결 (네트워크 일시 단절 대응)
    reconnectDelay: 3000,

    // 4초마다 heartbeat — 프록시가 idle connection을 끊는 상황 방지
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    // 운영에선 false. 개발 시에만 STOMP 프레임 콘솔 로그 활성화
    debug: import.meta.env.DEV
      ? (msg) => console.log("[STOMP]", msg)
      : () => {},
  });
}

export type { IMessage };
