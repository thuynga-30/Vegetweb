import api from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";
import type {FarmDetail, FarmListItem} from "@/types/farm.ts";

export const farmService = {
    getAll: () =>
        api.get("/farms") as Promise<ApiResponse<FarmListItem[]>>,

    getById: (id: number) =>
        api.get(`/farms/${id}`) as Promise<ApiResponse<FarmDetail>>,

    getMyFarm: () =>
        api.get("/farms/my") as Promise<ApiResponse<FarmDetail>>,

    updateMyFarm: (
        payload: Record<string, unknown>
    ) =>
        api.put("/farms/my", payload) as Promise<ApiResponse<FarmDetail>>,

    approve: (id: number, note?: string) =>
        api.put(`/farms/${id}/approve`, { note }) as Promise<ApiResponse<FarmDetail>>,

    reject: (id: number, note: string) =>
        api.put(`/farms/${id}/reject`, { note }) as Promise<ApiResponse<FarmDetail>>,
};