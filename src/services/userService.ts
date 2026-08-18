import api from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";
import type { User } from "@/types/user";

export const userService = {
    getAll: (role?: string) => api.get("/users", { params: { role } }) as Promise<ApiResponse<User[]>>,

    disable: (id: number) => api.put(`/users/${id}/disable`) as Promise<ApiResponse<User>>,

    enable: (id: number) => api.put(`/users/${id}/enable`) as Promise<ApiResponse<User>>,
};