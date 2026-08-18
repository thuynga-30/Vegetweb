
export interface CartItem {
    id: number;
    quantity: number;

    batch: {
        id: number;
        batchCode: string;
        quantityAvailable: number;
    };

    product: {
        id: number;
        name: string;
        price: number | string;
    } | null;

    farmName?: string;

    subtotal: number;
}

export interface CartResponse {
    items: CartItem[];
    totalAmount: number;
}

export interface AddToCartPayload {
    batchId: number;
    quantity: number;
}
export interface CartItemResponse {
    id: number;
    quantity: number;

    batch: {
        id: number;
        batchCode: string;
        quantityAvailable: number;
    };

    product: {
        id: number;
        name: string;
        price: number;
    } | null;

    farmName?: string;
    subtotal: number;
}

export interface MyCartResponse {
    items: CartItemResponse[];
    totalAmount: number;
}