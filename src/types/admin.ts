import type { EventStatus } from "@/types/event";
import type { TagEntity } from "@/types/tag";

export type GetPresignedUrlRequest = {
  fileName: string;
  contentType: string;
};

export type GetPresignedUrlResponse = {
  presignedUrl: string;
  imageUrl: string;
};

// ── Event ──────────────────────────────────────────────────────────────────

export type CreateEventRequest = {
  brandName: string;
  description: string;
  thumbnailImageUrl: string;
  imageUrl: string;
  startAt: string;
  endAt: string;
};

export type CreateEventResponse = {
  id: number;
  brandName: string;
  status: EventStatus;
};

export type UpdateEventRequest = {
  brandName?: string;
  description?: string;
  thumbnailImageUrl?: string;
  imageUrl?: string;
  startAt?: string;
  endAt?: string;
};

export type UpdateEventResponse = {
  id: number;
  brandName: string;
  status: EventStatus;
};

export type UpdateEventStatusRequest = {
  status: EventStatus;
};

export type UpdateEventStatusResponse = {
  id: number;
  status: EventStatus;
};

// ── Admin List Items ───────────────────────────────────────────────────────

export type AdminProductItem = {
  id: number;
  name: string;
  eventId: number;
  eventBrandName: string;
  imageUrl: string;
  description: string;
  price: number;
  stock: number;
  tags: TagEntity[];
};

// ── Product ────────────────────────────────────────────────────────────────

export type CreateProductRequest = {
  eventId: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  stock: number;
  // 옵셔널. # 없는 raw 이름 배열. 빈 배열·null 허용
  tagNames?: string[] | null;
};

export type CreateProductResponse = {
  id: number;
  name: string;
  stock: number;
  tags: TagEntity[];
};

export type UpdateProductRequest = {
  name?: string;
  imageUrl?: string;
  description?: string;
  price?: number;
  stock?: number;
  // null/미포함 = 변경 없음, [] = 모두 제거, [...] = 통째로 교체
  tagNames?: string[] | null;
};

export type UpdateProductResponse = {
  id: number;
  name: string;
  price: number;
  tags: TagEntity[];
};

export type UpdateProductStockRequest = {
  stock: number;
};

export type UpdateProductStockResponse = {
  id: number;
  stock: number;
};
