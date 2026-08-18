import api from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";
import type {
    Batch,
    CultivationLog,
    BatchImage,
    BatchFilter, BatchListItem, CreateBatchPayload, BatchTraceData,
} from "@/types/batch";


export const batchService = {
    getAll: (filter?: BatchFilter) =>
        api.get("/batches", { params: filter }) as Promise<ApiResponse<BatchListItem[]>>,

    // Admin: toàn bộ lô hàng bất kể trạng thái duyệt (Pending/Approved/Rejected)
    getAllAdmin: () => api.get("/admin/batches") as Promise<ApiResponse<BatchListItem[]>>,

    getById: (id: number) => api.get(`/batches/${id}`) as Promise<ApiResponse<BatchListItem>>,

    getTraceByCode: (batchCode: string) =>
        api.get(`/batches/code/${batchCode}`) as Promise<BatchTraceData>,

    addLog: (batchId: number, payload: { log_date: string; activity: string; description?: string }) =>
        api.post(`/batches/${batchId}/logs`, payload) as Promise<ApiResponse<CultivationLog>>,

    getMyBatches: () => api.get("/batches/my") as Promise<ApiResponse<BatchListItem[]>>,

    create: (payload: CreateBatchPayload) =>
        api.post("/batches", payload) as Promise<ApiResponse<Batch>>,

    update: (id: number, payload: Partial<Batch>) =>
        api.put(`/batches/${id}`, payload) as Promise<ApiResponse<Batch>>,

    uploadImages: (id: number, formData: FormData) =>
        api.post(`/batches/${id}/images`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }) as Promise<ApiResponse<BatchImage[]>>,

    approve: (id: number, note?: string) =>
        api.put(`/batches/${id}/approve`, { note }) as Promise<ApiResponse<Batch>>,

    reject: (id: number, note: string) =>
        api.put(`/batches/${id}/reject`, { note }) as Promise<ApiResponse<Batch>>,
};