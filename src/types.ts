// 공통 콜백 타입 
// useMutation 훅이 외부 콜백을 선택적으로 주입받을 때 사용
export type UseMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};

// 이벤트 도메인 
export type EventStatus = "UPCOMING" | "OPEN" | "CLOSED" | "FINISHED";

// 서버 응답 원본 타입 (API 스펙 기반)
export type EventEntity = {
  id: number;
  brandName: string;
  description: string;
  thumbnailImageUrl: string;
  imageUrl: string;
  startAt: string;
  endAt: string;
  status: EventStatus;
};

// 상품 도메인
// 서버 응답 원본 타입 (API 스펙 기반)
export type ProductEntity = {
  id: number;
  eventId: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  stock: number;
};

// 태그 도메인
export type TagEntity = {
  id: number;
  name: string;
};