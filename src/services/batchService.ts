import api from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";
import type {
    Batch,
    CultivationLog,
    BatchImage,
    BatchFilter,
    BatchListItem,
    CreateBatchPayload,
    BatchTraceData,
} from "@/types/batch";
import { mapApiBatchToListItem } from "@/lib/batchMapper";

export const batchService = {
    getAll: async (filter?: BatchFilter): Promise<BatchListItem[]> => {
        const response = await api.get("/batches", {
            params: filter,
        }) as ApiResponse<BatchListItem[]>;

        return response.data;
    },

    // Admin: toàn bộ lô hàng bất kể trạng thái duyệt
    getAllAdmin: async (): Promise<BatchListItem[]> => {
        const list = (await api.get("/admin/batches")) as unknown as any[];
        return list.map(mapApiBatchToListItem);
    },

    // Seller: chi tiết 1 lô của mình
    getById: async (id: number): Promise<BatchListItem> => {
        const raw = (await api.get(`/batches/${id}`)) as unknown as any;
        return mapApiBatchToListItem(raw);
    },

    // Seller: danh sách lô của mình (backend: GET /batches)
    getMyBatches: async (): Promise<BatchListItem[]> => {
        const list = (await api.get("/batches")) as unknown as any[];
        return list.map(mapApiBatchToListItem);
    },

    getTraceByCode: (batchCode: string) =>
        api.get(`/batches/code/${batchCode}`) as Promise<BatchTraceData>,

    create: async (payload: CreateBatchPayload): Promise<Batch> => {
        return (await api.post("/batches", payload)) as unknown as Batch;
    },

    update: async (id: number, payload: Partial<Batch>): Promise<Batch> => {
        return (await api.patch(`/batches/${id}`, payload)) as unknown as Batch;
    },

    // Không tự đặt Content-Type, để trình duyệt thêm boundary
    uploadImages: async (id: number, formData: FormData): Promise<BatchImage[]> => {
        return (await api.post(`/batches/${id}/images`, formData)) as unknown as BatchImage[];
    },

    // Nhật ký nằm sẵn trong GET /batches/:id (cultivationLogs)
    getLogs: async (id: number): Promise<CultivationLog[]> => {
        const raw = (await api.get(`/batches/${id}`)) as unknown as any;
        return (raw.cultivationLogs ?? [])
            .map((l: any) => ({
                id: l.id,
                batch_id: id,
                activity: l.activity,
                description: l.description ?? undefined,
                image: l.image ?? undefined,
                log_date: l.log_date,
            }))
            .sort((a: any, b: any) => String(a.log_date).localeCompare(String(b.log_date)));
    },

    addLog: async (
        id: number,
        payload: { log_date: string; activity: string; description?: string; image?: string }
    ): Promise<CultivationLog> => {
        return (await api.post(`/batches/${id}/logs`, payload)) as unknown as CultivationLog;
    },
};