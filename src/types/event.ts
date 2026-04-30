export type EventStatus =
  | "UPCOMING"
  | "OPEN"
  | "SOLD_OUT"
  | "CLOSED"
  | "FINISHED";

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

export type PaginatedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type EventListItem = {
  id: number;
  brandName: string;
  thumbnailImageUrl: string;
  status: EventStatus;
  startAt: string;
  endAt: string;
};

export type EventProductItem = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
};

export type EventDetailEntity = {
  id: number;
  brandName: string;
  description: string;
  imageUrl: string;
  status: EventStatus;
  startAt: string;
  endAt: string;
  products: PaginatedResponse<EventProductItem>;
};

export type LineupRound = {
  round: number;
  status: EventStatus;
  brands: string[];
};

// GET /events/popular 응답 1건의 형태
// 백엔드에서 score는 @JsonIgnore로 응답에서 제외되며, 정렬 순서로만 인기도가 표현됨
export type PopularEventItem = {
  id: number;
  brandName: string;
  thumbnailImageUrl: string;
  status: EventStatus;
  startAt: string;
  endAt: string;
};

// WebSocket으로 받는 재고 변경 메시지
// 백엔드 StockUpdateMessage record와 1:1 매핑
// stock은 "차감/복구 후의 절대값" → 그대로 화면에 반영하면 됨
export type StockUpdateMessage = {
  eventId: number;
  productId: number;
  stock: number;
  occurredAt: string;
};
