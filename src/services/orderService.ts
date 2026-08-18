import api from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";
import type {CheckoutPayload, CheckoutResponse, Order, OrderDetail} from "@/types/order";

export interface OrderWithDetails extends Order {
    details: OrderDetail[];
}

export interface CreateOrderPayload {
    receiver_name: string;
    receiver_phone: string;
    shipping_address: string;
    items: { batch_id: number; quantity: number }[];
}

export const orderService = {
    create: (payload: CreateOrderPayload) =>
        api.post("/orders", payload) as Promise<ApiResponse<Order>>,

    checkout: (payload: CheckoutPayload) =>
        api.post("/orders/checkout", payload) as Promise<CheckoutResponse>,
    getMyOrders: (status?: string) =>
        api.get("/orders", { params: { status } }) as Promise<ApiResponse<OrderWithDetails[]>>,

    getById: (id: number) =>
        api.get(`/orders/${id}`) as Promise<ApiResponse<OrderWithDetails>>,

    confirmReceived: (id: number) =>
        api.put(`/orders/${id}/confirm`) as Promise<ApiResponse<Order>>,

    getSellerOrders: (status?: string) =>
        api.get("/orders/seller", { params: { status } }) as Promise<ApiResponse<OrderWithDetails[]>>,

    getAll: (status?: string) =>
        api.get("/orders", { params: { status } }) as Promise<ApiResponse<OrderWithDetails[]>>,

    updateStatus: (id: number, status: string) =>
        api.put(`/orders/${id}/status`, { status }) as Promise<ApiResponse<Order>>,
};