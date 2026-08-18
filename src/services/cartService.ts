import api from "@/lib/axios";

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

export interface CartResponse {
    items: CartItemResponse[];
    totalAmount: number;
}

export const cartService = {

    getMyCart: () =>
        api.get("/cart") as Promise<CartResponse>,

    addToCart: (
        batchId: number,
        quantity: number
    ) =>
        api.post("/cart", {
            batchId,
            quantity,
        }) as Promise<{
            message: string;
        }>,

    updateItem: (
        cartId: number,
        quantity: number
    ) =>
        api.patch(`/cart/${cartId}`, {
            quantity,
        }) as Promise<{
            message: string;
        }>,

    removeItem: (cartId: number) =>
        api.delete(`/cart/${cartId}`) as Promise<{
            message: string;
        }>,
};