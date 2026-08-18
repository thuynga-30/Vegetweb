export interface Product {
    id: number;
    farm_id: number;
    category_id: number;
    name: string;
    description?: string;
    price: number;
    created_at: string;
}

export interface ProductCard {
    id: number;
    name: string;
    price: number;
    image: string | null;

    farmName?: string;
    farmAddress?: string;

    farmTrustLevel?: "Low" | "Medium" | "High";
    batchTrustLevel?: "Low" | "Medium" | "High";

    categoryName?: string;
    remainingQuantity?: number;
}

export interface ProductDetail {
    id: number;
    name: string;
    price: number;
    image: string | null;

    farm: {
        id: number;
        farmName: string;
        address?: string;
        trustLevel?: "Low" | "Medium" | "High";
    } | null;

    isFullyVerified: boolean;

    currentBatch: {
        id: number;
        batchCode: string;
        quantity: number;
        plantingDate: string;
        harvestDate: string;
        trustLevel: "Low" | "Medium" | "High";
    } | null;

    reviews: {
        averageRating: string | null;
        totalReviews: number;
        items: ReviewItem[];
    };
}

export interface ReviewItem {
    id: number;
    rating: number;
    comment?: string;
    buyerName?: string;
    createdAt: string;
}

export interface GetProductsParams {
    search?: string;
    categoryId?: number;
    farmTrustLevel?: "Low" | "Medium" | "High";
    batchTrustLevel?: "Low" | "Medium" | "High";
    province?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sort?: "newest" | "price_asc" | "price_desc";
}

export interface PaginatedMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedProducts {
    data: ProductCard[];
    meta: PaginatedMeta;
}