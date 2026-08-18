export type UserRole = "Admin" | "Seller" | "Buyer";
export type UserStatus = "Active" | "Disabled";

export interface User {
    id: number;
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    avatar?: string;
    role: UserRole;
    status?: UserStatus;
    created_at: string;
    updated_at?: string;
}