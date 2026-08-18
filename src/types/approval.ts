export interface Approval {
    id: number;
    batch_id: number;
    admin_id: number;
    status: "Approved" | "Rejected";
    note?: string;
    approved_at: string;
}
