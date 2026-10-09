import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { approvalService } from "@/services/approvalService";
import { TrustBadge } from "@/components/common/TrustBadge";
import { formatDate } from "@/lib/utils";
import type { ApprovalStatus } from "@/types/batch";

export default function ApprovalsPage() {
    const [filter, setFilter] = useState<ApprovalStatus | "All">("Pending");
    // approvalService.getPending() chỉ trả batch đang Pending —
    // nên khi filter khác "Pending"/"All", danh sách sẽ rỗng cho tới khi
    // có endpoint riêng trả toàn bộ trạng thái (xem ghi chú bên dưới)
    const { data: batches, loading } = useFetch(
        () => (filter === "Pending" ? approvalService.getPending() : approvalService.getAll()),
        [filter]
    );

    const list = (batches ?? []).filter((b) => (filter === "All" ? true : b.approval_status === filter));
    console.log("sample:", batches?.[0]);
    return (
        <div>
            <div className="flex items-center gap-2 mb-5">
                {(["Pending", "Approved", "Rejected", "All"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm ${filter === f ? "bg-primary text-primary-foreground" : "border"}`}
                    >
                        {f === "Pending" ? "Chờ duyệt" : f === "Approved" ? "Đã duyệt" : f === "Rejected" ? "Từ chối" : "Tất cả"}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-muted-foreground">Đang tải...</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {list.map((b) => (
                        <Link key={b.id} to={`/admin/approvals/${b.id}`} className="bg-card border rounded-2xl p-4 flex gap-4 hover:border-primary transition">
                            {b?.image && <img src={b.image} className="w-24 h-24 rounded-xl object-cover" alt="" />}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold truncate">{b.product_name}</span>
                                    <TrustBadge level={b.trust_level} size="sm" />
                                </div>
                                <div className="text-xs text-muted-foreground font-mono mt-0.5">{b.batch_code}</div>
                                <div className="text-xs text-muted-foreground mt-1">{b.farm_name}</div>
                                <div className="text-xs mt-2 grid grid-cols-2 gap-1">
                                    <span>Thu hoạch: <b>{formatDate(b.harvest_date)}</b></span>
                                    <span>SL: <b>{b.quantity}kg</b></span>
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <span className="text-xs text-primary">Xem duyệt →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {list.length === 0 && <p className="text-sm text-muted-foreground col-span-2">Không có lô hàng nào.</p>}
                </div>
            )}
        </div>
    );
}