import api from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";
import type { User } from "@/types/user";

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
}

export const authService = {
    login: (email: string, password: string) =>
        api.post("/auth/login", { email, password }) as Promise<LoginResponse>,

    register: (payload: {
        full_name: string;
        email: string;
        password: string;
        phone: string;
        address: string;
        role: "buyer" | "seller";
    }) => api.post("/auth/register", payload) as Promise<ApiResponse<User>>,

    getProfile: () => api.get("/users/profile") as Promise<ApiResponse<User>>,

    updateProfile: (
        payload: Partial<Pick<User, "full_name" | "phone" | "address" | "avatar">>
    ) => api.put("/users/profile", payload) as Promise<ApiResponse<User>>,
    uploadAvatar: (file: File) => {

        const formData = new FormData();

        formData.append("file", file);

        return api.post(
            "/users/profile/avatar",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            },
        ) as Promise<ApiResponse<User>>;
    },
};
