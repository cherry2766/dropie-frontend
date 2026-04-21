import type { PaginatedResponse } from "@/types/event";

export type OrderStatus = "PENDING" | "PAID" | "CANCELED";

export type CreateOrderRequest = {
  receiverName: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2: string;
  items: { productId: number; quantity: number }[];
};

export type CreateOrderResponse = {
  orderId: number;
  orderNumber: string;
  totalPrice: number;
  status: OrderStatus;
};

export type OrderListItem = {
  orderId: number;
  orderNumber: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
};

export type OrderDetailItem = {
  productId: number;
  productName: string;
  quantity: number;
  orderPrice: number;
};

export type OrderDetail = {
  orderId: number;
  orderNumber: string;
  receiverName: string;
  phone: string;
  address: string;
  totalPrice: number;
  status: OrderStatus;
  items: OrderDetailItem[];
};

export type OrderListResponse = PaginatedResponse<OrderListItem>;

export type CancelOrderResponse = {
  orderId: number;
  status: OrderStatus;
};
