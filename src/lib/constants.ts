import type { TrustLevel, ApprovalStatus } from "@/types/batch";
import type { OrderStatus } from "@/types/order";
import type { UserStatus } from "@/types/user";

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
    Active: "Đang hoạt động",
    Disabled: "Đã vô hiệu hóa",
};

export const USER_STATUS_COLOR: Record<UserStatus, string> = {
    Active: "bg-primary/15 text-primary",
    Disabled: "bg-destructive/10 text-destructive",
};

export const TRUST_LEVEL_LABEL: Record<TrustLevel, string> = {
    Low: "Đã xác minh cơ bản",
    Medium: "Nhật ký canh tác đầy đủ",
    High: "Chứng nhận & Xác minh toàn diện",
};

export const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
    Pending: "Chờ duyệt",
    Approved: "Đã duyệt",
    Rejected: "Từ chối",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    Pending: "Chờ xử lý",
    Confirmed: "Đã xác nhận",
    Preparing: "Đang chuẩn bị",
    Shipping: "Đang giao",
    Delivered: "Đã giao",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
    Pending: "bg-muted text-muted-foreground",
    Confirmed: "bg-blue-100 text-blue-700",
    Preparing: "bg-amber-100 text-amber-700",
    Shipping: "bg-indigo-100 text-indigo-700",
    Delivered: "bg-primary/15 text-primary",
    Completed: "bg-primary/15 text-primary",
    Cancelled: "bg-destructive/10 text-destructive",
};

export const APPROVAL_STATUS_COLOR: Record<ApprovalStatus, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-primary/15 text-primary",
    Rejected: "bg-destructive/10 text-destructive",
};