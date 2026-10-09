import api from "@/lib/axios";
import type { BatchListItem, TrustLevel } from "@/types/batch";
import { type ApiBatch, mapApiBatchToListItem } from "@/lib/batchMapper";

function unwrap<T>(res: any): T {
    if (res && typeof res === "object" && !Array.isArray(res) && "success" in res && "data" in res) {
        return res.data as T;
    }
    return res as T;
}

// Lấy id admin từ JWT (payload.sub) mỗi lần gọi, không dùng số cố định
function getCurrentAdminId(): number {
    try {
        const token = localStorage.getItem("gf_token");
        if (!token) return 0;
        const payload = JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        return Number(payload.sub);
    } catch {
        return 0;
    }
}

// Giữ export này để ApprovalDetailPage không phải sửa (service bỏ qua giá trị này, dùng id từ JWT)
export const CURRENT_ADMIN_ID = getCurrentAdminId();
const STATUS_MAP: Record<string, "Pending" | "Approved" | "Rejected"> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
};

// Luôn lấy trạng thái từ dữ liệu gốc của backend, không phụ thuộc mapper
const toItem = (raw: any): BatchListItem => {
    const item = mapApiBatchToListItem(raw);
    const rawStatus = String(raw?.approval_status ?? raw?.approvalStatus ?? "").toLowerCase();

    // Lấy ảnh đầu tiên từ dữ liệu gốc của backend
    const first = raw?.images?.[0];
    const rawImage: string | null =
        typeof first === "string" ? first : first?.image_url ?? null;

    return {
        ...item,
        approval_status: STATUS_MAP[rawStatus] ?? item.approval_status,
        image: item.image ?? rawImage,
    };
};
export const approvalService = {
    getPending: async (): Promise<BatchListItem[]> => {
        const res = await api.get("/approval/pending");
        return unwrap<ApiBatch[]>(res).map(toItem);
    },

    getAll: async (): Promise<BatchListItem[]> => {
        const res = await api.get("/approval");
        return unwrap<ApiBatch[]>(res).map(toItem);
    },

    getById: async (id: number) => {
        const res = await api.get(`/approval/${id}`);
        const raw = unwrap<any>(res);
        return {
            ...mapApiBatchToListItem(raw),
            images: (raw.images ?? [])
                .map((img: any) => (typeof img === "string" ? img : img.image_url ?? img.imageUrl))
                .filter(Boolean) as string[],
            cultivationLogs: raw.cultivationLogs ?? [],
        };
    },

    approve: async (
        id: number,
        _adminId: number,
        trustLevel: TrustLevel,
        note?: string
    ): Promise<BatchListItem> => {
        const res = await api.post(`/approval/${id}/approve`, {
            adminId: getCurrentAdminId(),
            trustLevel,
            note: note || undefined,
        });
        return mapApiBatchToListItem(unwrap<ApiBatch>(res));
    },

    reject: async (id: number, _adminId: number, reason: string): Promise<BatchListItem> => {
        const res = await api.post(`/approval/${id}/reject`, {
            adminId: getCurrentAdminId(),
            reason,
        });
        return mapApiBatchToListItem(unwrap<ApiBatch>(res));
    },
};