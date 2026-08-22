import api from "@/lib/axios";
import type {CartResponse} from "@/types/cart.ts";

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