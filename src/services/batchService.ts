import api from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";
import type {
    Batch,
    CultivationLog,
    BatchImage,
    BatchFilter, BatchListItem, CreateBatchPayload, BatchTraceData,
} from "@/types/batch";
import { mapApiBatchToListItem } from "@/lib/batchMapper";
// const toListItem = (b: any): BatchListItem => ({
//     ...b,
//     product_id: b.product?.id,
//     product_name: b.product?.name ?? "",
//     farm_id: b.product?.farm?.id,
//     farm_name: b.product?.farm?.farm_name ?? "",
//     price: Number(b.product?.price ?? 0),
//     image: b.images?.[0]?.image_url ?? null,
// });
export const batchService = {
    getAll: async (filter?: BatchFilter): Promise<BatchListItem[]> => {
        const response = await api.get("/batches", {
            params: filter,
        }) as ApiResponse<BatchListItem[]>;

        return response.data;
    },
    // Admin: toàn bộ lô hàng bất kể trạng thái duyệt (Pending/Approved/Rejected)
    getAllAdmin: async () => {
        const response = await api.get("/batches/admin/all");
        return response as unknown as Batch[];
    },
    getById: async (id: number): Promise<BatchListItem> => {
        const response = await api.get(`/batches/${id}`) as ApiResponse<BatchListItem>;

        return response.data;
    },
    getMyBatches: async (): Promise<BatchListItem[]> => {
        const list = (await api.get("/batches")) as unknown as any[];
        return list.map(mapApiBatchToListItem);
    },
    getTraceByCode: (batchCode: string) =>
        api.get(`/batches/code/${batchCode}`) as Promise<BatchTraceData>,

    create: async (payload: CreateBatchPayload): Promise<Batch> => {
        const response = await api.post(
            "/batches",
            payload
        ) as ApiResponse<Batch>;

        return response.data;
    },
    update: async (
        id: number,
        payload: Partial<Batch>
    ): Promise<Batch> => {
        const response = await api.put(
            `/batches/${id}`,
            payload
        ) as ApiResponse<Batch>;

        return response.data;
    },
    uploadImages: async (
        id: number,
        formData: FormData
    ): Promise<BatchImage[]> => {
        const response = await api.post(
            `/batches/${id}/images`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        ) as ApiResponse<BatchImage[]>;

        return response.data;
    },
    approve: async (
        id: number,
        note?: string
    ): Promise<Batch> => {
        const response = await api.put(
            `/batches/${id}/approve`,
            { note }
        ) as ApiResponse<Batch>;

        return response.data;
    },

    reject: async (
        id: number,
        note: string
    ): Promise<Batch> => {
        const response = await api.put(
            `/batches/${id}/reject`,
            { note }
        ) as ApiResponse<Batch>;

        return response.data;
    },

    getLogs: async (id: number): Promise<CultivationLog[]> => {
        const response = await api.get(
            `/batches/${id}/logs`
        ) as ApiResponse<CultivationLog[]>;

        return response.data;
    },

    addLog: async (
        id: number,
        payload: {
            log_date: string;
            activity: string;
            description?: string;
            image?: string;
        }
    ): Promise<CultivationLog> => {
        const response = await api.post(
            `/batches/${id}/logs`,
            payload
        ) as ApiResponse<CultivationLog>;

        return response.data;
    },
};