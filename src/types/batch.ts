export type TrustLevel = "Low" | "Medium" | "High";
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export interface Batch {
    id: number;
    product_id: number;
    batch_code: string;
    planting_date: string;
    harvest_date: string;
    quantity: number;
    barcode?: string;
    trust_level: TrustLevel;
    approval_status: ApprovalStatus;
    created_at: string;
}

export interface CultivationLog {
    id: number;
    batch_id: number;
    activity: string;
    description?: string;
    image?: string;
    log_date: string;
}

export interface BatchImage {
    id: number;
    batch_id: number;
    image_url: string;
}
export interface BatchFilter {
    category_id?: number;
    trust_level?: string;
    keyword?: string;
    page?: number;
}


export interface BatchListItem extends Batch {
    product_name: string;
    image: string | null;
    farm_name: string;
    farm_id: number;
    price: number;
    sold?: number;
}

export interface BatchTraceData {
    batchCode: string;
    plantingDate: string;
    harvestDate: string;
    trustLevel: TrustLevel;
    isFullyVerified: boolean;
    productName: string;

    farm: {
        farmName: string;
        address?: string;
    };

    cultivationLogs: CultivationLog[];

    images: string[];
}

export interface CreateBatchPayload {
    product_name: string;
    planting_date: string;
    harvest_date: string;
    quantity: number;
    price?: number;
    image?: string;
    logs: { log_date: string; activity: string; description?: string }[];
}

