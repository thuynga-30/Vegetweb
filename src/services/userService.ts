import api from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";
import type { User } from "@/types/user";

// Backend: 'active' | 'locked'  ->  Frontend: "Active" | "Disabled"
const toUser = (u: any): User => ({
    ...u,
    status: u.status === "locked" ? "Disabled" : "Active",
});

export const userService = {
    getAll: async (role?: string): Promise<User[]> => {
        const response = await api.get("/admin/users", {
            params: { role: role || undefined, limit: 100 },
        }) as ApiResponse<{ items: any[] }>;

        return response.data.items.map(toUser);
    },

    getCount: async (): Promise<number> => {
        const response = await api.get("/admin/users", {
            params: { limit: 1 },
        }) as ApiResponse<{ meta: { total: number } }>;
        return response.data.meta.total;
    },

    disable: (id: number) => api.patch(`/admin/users/${id}/lock`),

    enable: (id: number) => api.patch(`/admin/users/${id}/unlock`),
};