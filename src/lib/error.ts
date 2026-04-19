import axios from "axios";

export const ERROR_MESSAGE_MAP = {
  INVALID_INPUT: "입력값이 올바르지 않습니다.",
  INVALID_CREDENTIALS: "이메일 또는 비밀번호가 올바르지 않습니다.",
  UNAUTHORIZED: "로그인이 필요합니다.",
  FORBIDDEN: "접근 권한이 없습니다.",

  INVALID_TOKEN: "유효하지 않은 토큰입니다.",
  EXPIRED_TOKEN: "만료된 토큰입니다.",

  USER_NOT_FOUND: "존재하지 않는 사용자입니다.",
  DUPLICATE_EMAIL: "이미 사용 중인 이메일입니다.",
  DUPLICATE_NICKNAME: "이미 사용 중인 닉네임입니다.",

  EVENT_NOT_FOUND: "존재하지 않는 이벤트입니다.",
  EVENT_NOT_STARTED: "아직 판매 시작 전입니다.",
  EVENT_ENDED: "판매가 종료되었습니다.",
  INVALID_STATUS_TRANSITION: "유효하지 않은 상태 전환입니다.",

  PRODUCT_NOT_FOUND: "존재하지 않는 상품입니다.",
  OUT_OF_STOCK: "재고가 부족합니다.",
  INVALID_QUANTITY: "잘못된 수량 요청입니다.",

  ORDER_NOT_FOUND: "존재하지 않는 주문입니다.",
  ORDER_TIME_NOT_ALLOWED: "주문 가능한 시간이 아닙니다.",
  CANCEL_NOT_ALLOWED: "취소할 수 없는 주문 상태입니다.",
  DUPLICATE_ORDER_ITEM: "동일한 상품을 중복 요청할 수 없습니다.",

  TAG_NOT_FOUND: "존재하지 않는 태그입니다.",
  ADDRESS_NOT_FOUND: "존재하지 않는 배송지입니다.",

  LOCK_ACQUISITION_FAILED: "현재 요청이 많습니다. 잠시 후 다시 시도해주세요.",
  ORDER_CONFLICT: "주문 처리 중 문제가 발생했습니다. 다시 시도해주세요.",
  TOO_MANY_REQUESTS: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",

  S3_UPLOAD_URL_GENERATION_FAILED: "이미지 업로드 URL 생성에 실패했습니다.",
  INVALID_VERIFICATION_TOKEN: "유효하지 않거나 만료된 인증 링크입니다.",
  EMAIL_NOT_VERIFIED: "이메일 인증이 완료되지 않았습니다. 인증 메일을 확인해주세요.",
  LOGIN_BLOCKED: "로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.",
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGE_MAP;

export interface ApiErrorResponse {
  code: ErrorCode;
  message: string;
}

const DEFAULT_ERROR_MESSAGE =
  "문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;

    if (!data) {
      return DEFAULT_ERROR_MESSAGE;
    }

    // 1순위: 백엔드에서 내려준 message
    if (data.message) {
      return data.message;
    }

    // 2순위: code로 프론트 메시지 매핑
    if (data.code && data.code in ERROR_MESSAGE_MAP) {
      return ERROR_MESSAGE_MAP[data.code];
    }
  }

  return DEFAULT_ERROR_MESSAGE;
}