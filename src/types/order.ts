export type OrderStatus =
    | "Pending" | "Confirmed" | "Preparing"
    | "Shipping" | "Delivered" | "Completed" | "Cancelled";

export interface Order {
    id: number;
    buyer_id: number;
    receiver_name: string;
    receiver_phone: string;
    shipping_address: string;
    total_price: number;
    status: OrderStatus;
    tracking_note?: string;
    created_at: string;
    seller_total?: number;
}

export interface OrderDetail {
    id: number;
    order_id: number;
    batch_id: number;
    quantity: number;
    price: number;
    product_name?: string;
    image?: string;
    farm_name?: string;
    batch_code?: string;
}
export interface CheckoutPayload {
    cartItemIds: number[];
    receiverName: string;
    receiverPhone: string;
    shippingAddress: string;
    paymentMethod?: "COD" | "ZaloPay" | "Momo"|"VNPay";
}

export interface CheckoutResponse {
    orderId: number;
    totalPrice: number;
    message: string;
}