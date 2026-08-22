export interface CartItem {
    id: number;
    quantity: number;
    batch:{
        id: number;
        batchCode: string;
        quantityAvailable: number; }
    ; product: {
        id: number;
        name: string;
        price: number | string; } | null;
    image: string | null;
    farmName?: string;
    subtotal: number; }

export interface CartResponse {
    items: CartItem[];
    totalAmount: number;
}

export interface AddToCartPayload {
    batchId: number;
    quantity: number;
}
