import api from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";
import type { Review } from "@/types/review";

export const reviewService = {
    create: (
        productId: number,
        payload: Review
    ) =>
        api.post(`/products/${productId}/reviews`, payload) as Promise<
            ApiResponse<{ message: string }>
        >,
};