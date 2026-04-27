export type EventStatus = "UPCOMING" | "OPEN" | "SOLD_OUT" | "CLOSED" | "FINISHED";

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
