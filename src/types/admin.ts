import type { EventStatus } from "@/types/event";

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
};

// ── Product ────────────────────────────────────────────────────────────────

export type CreateProductRequest = {
  eventId: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  stock: number;
};

export type CreateProductResponse = {
  id: number;
  name: string;
  stock: number;
};

export type UpdateProductRequest = {
  name?: string;
  imageUrl?: string;
  description?: string;
  price?: number;
  stock?: number;
};

export type UpdateProductResponse = {
  id: number;
  name: string;
  price: number;
};

export type UpdateProductStockRequest = {
  stock: number;
};

export type UpdateProductStockResponse = {
  id: number;
  stock: number;
};
