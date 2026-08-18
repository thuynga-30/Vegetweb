import api from "@/lib/axios";
import type {
    ProductDetail,
    GetProductsParams,
    PaginatedProducts,
} from "@/types/product";

export const productService = {
    getAll: (params?: GetProductsParams) =>
        api.get("/products", { params }) as Promise<PaginatedProducts>,

    getById: (id: number) =>
        api.get(`/products/${id}`) as Promise<ProductDetail>,
};