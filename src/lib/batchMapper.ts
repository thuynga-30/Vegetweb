import type { ApprovalStatus, BatchListItem, TrustLevel } from "@/types/batch";

const STATUS_MAP: Record<string, ApprovalStatus> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
};
export interface ApiFarm {
    id: number;
    seller_id: number;
    farm_name: string;
}

export interface ApiProduct {
    id: number;
    farm_id: number;
    category_id: number;
    name: string;
    description: string | null;
    price: string;
    farm?: ApiFarm;
}

export interface ApiBatchImage {
    id: number;
    batchId: number;
    imageUrl: string;
}

export interface ApiBatch {
    id: number;
    productId: number;
    product: ApiProduct;
    batchCode: string;
    plantingDate: string;
    harvestDate: string;
    quantity: number;
    barcode: string | null;
    trustLevel: TrustLevel | null;
    approvalStatus: ApprovalStatus;
    createdAt: string;
    images: ApiBatchImage[];
}

export function mapApiBatchToListItem(b: any): BatchListItem {
    const rawStatus = String(b.approval_status ?? b.approvalStatus ?? "").toLowerCase();
    const first = b.images?.[0];
    const image: string | null =
        typeof first === "string" ? first : first?.image_url ?? first?.imageUrl ?? null;

    return {
        id: b.id,
        product_id: b.product?.id ?? b.product_id ?? b.productId,
        batch_code: b.batch_code ?? b.batchCode,
        planting_date: b.planting_date ?? b.plantingDate,
        harvest_date: b.harvest_date ?? b.harvestDate,
        quantity: b.quantity,
        barcode: b.barcode ?? undefined,
        trust_level: (b.trust_level ?? b.trustLevel) as TrustLevel,
        approval_status: STATUS_MAP[rawStatus] ?? "Pending",
        created_at: b.created_at ?? b.createdAt,
        product_name: b.product?.name ?? "",
        image,
        farm_name: b.product?.farm?.farm_name ?? "",
        farm_id: b.product?.farm?.id ?? b.product?.farm_id ?? 0,
        price: Number(b.product?.price ?? 0),
    };
}