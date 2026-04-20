import axios from "axios";
import api from "@/lib/api";
import type {
  GetPresignedUrlRequest,
  GetPresignedUrlResponse,
  CreateEventRequest,
  CreateEventResponse,
  UpdateEventRequest,
  UpdateEventResponse,
  UpdateEventStatusRequest,
  UpdateEventStatusResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  UpdateProductStockRequest,
  UpdateProductStockResponse,
} from "@/types/admin";

// ── Image ──────────────────────────────────────────────────────────────────

export async function getPresignedUrl(data: GetPresignedUrlRequest): Promise<GetPresignedUrlResponse> {
  const res = await api.post<GetPresignedUrlResponse>("/admin/images/presigned-url", data);
  return res.data;
}

// S3 PUT 업로드는 api 인스턴스 대신 raw axios 사용 (Authorization 헤더 불필요, S3 직접 요청)
export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  await axios.put(presignedUrl, file, {
    headers: { "Content-Type": file.type },
  });
}

// ── Events ─────────────────────────────────────────────────────────────────

export async function createEvent(data: CreateEventRequest): Promise<CreateEventResponse> {
  const res = await api.post<CreateEventResponse>("/admin/events", data);
  return res.data;
}

export async function updateEvent(
  eventId: number,
  data: UpdateEventRequest,
): Promise<UpdateEventResponse> {
  const res = await api.patch<UpdateEventResponse>(`/admin/events/${eventId}`, data);
  return res.data;
}

export async function updateEventStatus(
  eventId: number,
  data: UpdateEventStatusRequest,
): Promise<UpdateEventStatusResponse> {
  const res = await api.patch<UpdateEventStatusResponse>(`/admin/events/${eventId}/status`, data);
  return res.data;
}

export async function deleteEvent(eventId: number): Promise<void> {
  await api.delete(`/admin/events/${eventId}`);
}

// ── Products ───────────────────────────────────────────────────────────────

export async function createProduct(data: CreateProductRequest): Promise<CreateProductResponse> {
  const res = await api.post<CreateProductResponse>("/admin/products", data);
  return res.data;
}

export async function updateProduct(
  productId: number,
  data: UpdateProductRequest,
): Promise<UpdateProductResponse> {
  const res = await api.patch<UpdateProductResponse>(`/admin/products/${productId}`, data);
  return res.data;
}

export async function updateProductStock(
  productId: number,
  data: UpdateProductStockRequest,
): Promise<UpdateProductStockResponse> {
  const res = await api.patch<UpdateProductStockResponse>(
    `/admin/products/${productId}/stock`,
    data,
  );
  return res.data;
}

export async function deleteProduct(productId: number): Promise<void> {
  await api.delete(`/admin/products/${productId}`);
}
