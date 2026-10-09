import api from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";
import type {AdminFarmListResponse, FarmDetail, FarmListItem} from "@/types/farm.ts";

export const farmService = {
    // Public farm list
    getAll: async (): Promise<FarmListItem[]> => {
        const response: any = await api.get("/farms");
        const list = Array.isArray(response) ? response : response?.data ?? [];

        return list.map((farm: any): FarmListItem => ({
            id: farm.id,
            farmName: farm.farmName ?? farm.farm_name,
            address: farm.address,
            description: farm.description,
            status: farm.status,
            coverImage: farm.coverImage ?? farm.image ?? null,
        }));
    },

    // Seller xem farm của mình
    getById: async (id: number) => {
        const response =
            await api.get(`/seller/farms/${id}`) as ApiResponse<FarmDetail>;

        return response.data;
    },

    getMyFarm: async () => {
        const response =
            await api.get("/farms/my") as ApiResponse<FarmDetail>;

        return response.data;
    },

    // Admin - danh sách farm
    getAllAdmin: async () => {
        const response =
            await api.get("/admin/farms", {
                params: { limit: 100 },
            }) as ApiResponse<AdminFarmListResponse>;

        return response.data.data.map((farm): FarmListItem => ({
            id: farm.id,
            farmName: farm.farm_name,
            address: farm.address,
            description: farm.description,
            status: farm.status,
            coverImage: farm.image,
            sellerId: farm.seller_id,
            areaHa: farm.area_ha ?? undefined,
        }));
    },

    // Admin - chi tiết farm
    getByIdAdmin: async (id: number) => {
        const response =
            await api.get(`/admin/farms/${id}`) as ApiResponse<FarmDetail>;

        return response.data;
    },

    updateMyFarm: async (
        payload: Record<string, unknown>
    ) => {
        const response =
            await api.put(
                "/farms/my",
                payload
            ) as ApiResponse<FarmDetail>;

        return response.data;
    },

    // Admin - duyệt farm
    approve: async (id: number) => {
        const response =
            await api.patch(
                `/admin/farms/${id}/approve`
            ) as ApiResponse<unknown>;

        return response.data;
    },

    // Admin - từ chối farm
    reject: async (
        id: number,
        note?: string
    ) => {
        const response =
            await api.patch(
                `/admin/farms/${id}/reject`,
                { note }
            ) as ApiResponse<unknown>;

        return response.data;
    },
};