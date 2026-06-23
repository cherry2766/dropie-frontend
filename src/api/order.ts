import api from "@/lib/api";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderListResponse,
  OrderDetail,
  CancelOrderResponse,
  PaymentConfirmRequest,
  PaymentConfirmResponse,
} from "@/types/order";

export async function createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  const res = await api.post<CreateOrderResponse>("/orders", data);
  return res.data;
}

export async function getMyOrders(page = 1, size = 10): Promise<OrderListResponse> {
  const res = await api.get<OrderListResponse>("/orders/me", { params: { page, size } });
  return res.data;
}

export async function getOrderDetail(orderId: number): Promise<OrderDetail> {
  const res = await api.get<OrderDetail>(`/orders/${orderId}`);
  return res.data;
}

export async function cancelOrder(orderId: number): Promise<CancelOrderResponse> {
  const res = await api.patch<CancelOrderResponse>(`/orders/${orderId}/cancel`);
  return res.data;
}

export async function confirmPayment(
  orderId: number,
  data: PaymentConfirmRequest,
): Promise<PaymentConfirmResponse> {
  const res = await api.post<PaymentConfirmResponse>(
    `/orders/${orderId}/payment/confirm`,
    data,
  );
  return res.data;
}
