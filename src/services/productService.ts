import api from "@/lib/axios";
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
        return (await api.get("/seller/products")) as unknown as Product[];
    },
    create: async (payload: {
        category_id: number;
        name: string;
        description?: string;
        price: number;
        farm_id?: number;
    }): Promise<Product> => {
        return (await api.post("/seller/products", {
            categoryId: Number(payload.category_id),
            farmId: payload.farm_id,
            name: payload.name,
            description: payload.description || undefined,
            price: Number(payload.price),
        })) as unknown as Product;
    },
};