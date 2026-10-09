import { Fragment, useMemo, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { orderService } from "@/services/orderService";
// import { batchService } from "@/services/batchService";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Check, X, ChevronDown, Phone, MapPin, StickyNote } from "lucide-react";
import type { OrderStatus } from "@/types/order";

type Tab = "Pending" | "Approved" | "Cancelled" | "All";

const TABS: { key: Tab; label: string }[] = [
    { key: "Pending", label: "Chờ duyệt" },
    { key: "Approved", label: "Đã duyệt" },
    { key: "Cancelled", label: "Từ chối" },
    { key: "All", label: "Tất cả" },
];

// Các trạng thái coi là "đã duyệt" — mọi trạng thái sau khi admin xác nhận đơn, trước khi hoàn tất/hủy
const APPROVED_STATUSES: OrderStatus[] = ["Confirmed", "Preparing", "Shipping", "Delivered", "Completed"];

export default function AdminOrdersPage() {
    const [tab, setTab] = useState<Tab>("Pending");
    const { data: orders, loading, refetch } = useFetch(() => orderService.getAll(), []);
    // const { data: batches } = useFetch(() => batchService.getAll(), []);
    const [actingId, setActingId] = useState<number | null>(null);
    const [expanded, setExpanded] = useState<number | null>(null);

    // const batchById = useMemo(() => {
    //     const map = new Map<number, NonNullable<typeof batches>[number]>();
    //     batches?.forEach((b) => map.set(b.id, b));
    //     return map;
    // }, [batches]);

    const filtered = useMemo(() => {
        if (!orders) return [];
        if (tab === "All") return orders;
        if (tab === "Pending") return orders.filter((o) => o.status === "Pending");
        if (tab === "Cancelled") return orders.filter((o) => o.status === "Cancelled");
        return orders.filter((o) => APPROVED_STATUSES.includes(o.status));
    }, [orders, tab]);

    const counts = useMemo(() => {
        if (!orders) return { Pending: 0, Approved: 0, Cancelled: 0, All: 0 };
        return {
            Pending: orders.filter((o) => o.status === "Pending").length,
            Approved: orders.filter((o) => APPROVED_STATUSES.includes(o.status)).length,
            Cancelled: orders.filter((o) => o.status === "Cancelled").length,
            All: orders.length,
        };
    }, [orders]);

    const act = async (id: number, status: OrderStatus) => {
        setActingId(id);
        try {
            await orderService.updateStatus(id, status);
            refetch();
        } finally {
            setActingId(null);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-5">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
                            tab === t.key ? "bg-primary text-primary-foreground" : "border"
                        }`}
                    >
                        {t.label}
                        <span className={`text-xs ${tab === t.key ? "opacity-90" : "text-muted-foreground"}`}>
                            ({counts[t.key]})
                        </span>
                    </button>
                ))}
            </div>

            <div className="bg-card border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                        <th className="text-left p-3">Mã đơn</th>
                        <th className="text-left p-3">Khách</th>
                        <th className="text-left p-3">Địa chỉ</th>
                        <th className="text-left p-3">Ngày</th>
                        <th className="text-left p-3">Trạng thái</th>
                        <th className="text-right p-3">Tổng</th>
                        {tab === "Pending" && <th className="text-right p-3">Thao tác</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((o) => {
                        const isOpen = expanded === o.id;
                        return (
                            <Fragment key={o.id}>
                                <tr
                                    onClick={() => setExpanded(isOpen ? null : o.id)}
                                    className="border-t cursor-pointer hover:bg-muted/30"
                                >
                                    <td className="p-3 font-mono">
                                        <div className="flex items-center gap-1.5">
                                            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                            #{o.id}
                                        </div>
                                    </td>
                                    <td className="p-3">{o.receiver_name}</td>
                                    <td className="p-3 text-muted-foreground">{o.shipping_address}</td>
                                    <td className="p-3">{formatDate(o.created_at)}</td>
                                    <td className="p-3"><StatusBadge status={o.status} /></td>
                                    <td className="p-3 text-right font-semibold">{formatCurrency(o.total_price)}</td>
                                    {tab === "Pending" && (
                                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    disabled={actingId === o.id}
                                                    onClick={() => act(o.id, "Confirmed")}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 disabled:opacity-50"
                                                >
                                                    <Check className="w-3.5 h-3.5" /> Duyệt
                                                </button>
                                                <button
                                                    disabled={actingId === o.id}
                                                    onClick={() => act(o.id, "Cancelled")}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 disabled:opacity-50"
                                                >
                                                    <X className="w-3.5 h-3.5" /> Từ chối
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                                {isOpen && (
                                    <tr className="border-t bg-muted/20">
                                        <td colSpan={tab === "Pending" ? 7 : 6} className="p-4">
                                            <div className="grid md:grid-cols-[1fr_260px] gap-5">
                                                {/* Danh sách sản phẩm trong đơn */}
                                                <div className="space-y-2">
                                                    {o.details?.map((d) => (
                                                        <div key={d.id}
                                                             className="flex items-center gap-3 bg-card border rounded-xl p-2.5">
                                                            {d.image && <img src={d.image} alt=""
                                                                             className="w-12 h-12 rounded-lg object-cover flex-shrink-0"/>}
                                                            <div className="flex-1 min-w-0">
                                                                <div
                                                                    className="font-medium text-sm truncate">{d.product_name ?? `Lô hàng #${d.batch_id}`}</div>
                                                                <div className="text-xs text-muted-foreground truncate">
                                                                    {d.farm_name} · Mã lô {d.batch_code} ·
                                                                    SL: {d.quantity}
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="font-semibold text-sm">{formatCurrency((d.price ?? 0) * d.quantity)}</div>
                                                        </div>
                                                    ))}
                                                    {(!o.details || o.details.length === 0) && (
                                                        <p className="text-xs text-muted-foreground">Không có chi tiết
                                                            sản phẩm.</p>
                                                    )}
                                                </div>
                                                {/* Thông tin giao hàng */}
                                                <div className="bg-card border rounded-xl p-3 space-y-2 text-sm h-fit">
                                                    <div className="flex items-start gap-2">
                                                        <Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5"/>
                                                        <span>{o.receiver_phone}</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5"/>
                                                        <span>{o.shipping_address}</span>
                                                    </div>
                                                    {o.tracking_note && (
                                                        <div className="flex items-start gap-2 text-muted-foreground">
                                                            <StickyNote className="w-3.5 h-3.5 mt-0.5" />
                                                            <span>{o.tracking_note}</span>
                                                        </div>
                                                    )}
                                                    <div className="border-t pt-2 flex justify-between font-semibold">
                                                        <span>Tổng cộng</span>
                                                        <span className="text-primary">{formatCurrency(o.total_price)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        );
                    })}
                    </tbody>
                </table>
                {!loading && filtered.length === 0 && (
                    <p className="text-sm text-muted-foreground p-6 text-center">
                        {tab === "Pending" ? "Không có đơn hàng nào đang chờ duyệt." : "Không có đơn hàng nào."}
                    </p>
                )}
            </div>
        </div>
    );
}