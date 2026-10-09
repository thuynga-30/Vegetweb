import api, {type ApiResponse} from "@/lib/axios";
import type {
    ProductDetail,
    GetProductsParams,
    PaginatedProducts, Product,
} from "@/types/product";

export const productService = {
    getAll: (params?: GetProductsParams) =>
        api.get("/products", { params }) as Promise<PaginatedProducts>,

    getById: (id: number) =>
        api.get(`/products/${id}`) as Promise<ProductDetail>,
    getMyProducts: async (): Promise<Product[]> => {
        const response = await api.get("/seller/products") as ApiResponse<Product[]>;
        return response.data;
    },
    create: (payload: { category_id: number; name: string; description?: string; price: number }) =>
        api.post("/seller/products", payload) as Promise<ApiResponse<Product>>,
};