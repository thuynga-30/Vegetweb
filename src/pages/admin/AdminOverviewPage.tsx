import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { batchService } from "@/services/batchService";
import { orderService } from "@/services/orderService";
import { userService } from "@/services/userService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, Package, CheckSquare, ShoppingBag, ArrowRight } from "lucide-react";

export default function AdminOverviewPage() {
    // const { data: users } = useFetch(() => userService.getAll(), []);
    const { data: batches } = useFetch(() => batchService.getAllAdmin(), []);
    const { data: orders } = useFetch(() => orderService.getAll(), []);
    const { data: userCount } = useFetch(() => userService.getCount(), []);
    const pending = batches?.filter((b) => b.approval_status === "Pending") ?? [];
    const revenue = orders?.filter((o) => o.status !== "Cancelled")
        .reduce((s, o) => s + Number(o.total_price), 0) ?? 0;
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
                <Kpi icon={Users} label="Tổng người dùng" value={String(userCount ?? 0)} />                <Kpi icon={Package} label="Lô hàng đang bán" value={String(batches?.filter((b) => b.approval_status === "Approved").length ?? 0)} />
                <Kpi icon={CheckSquare} label="Chờ kiểm duyệt" value={String(pending.length)} highlight={pending.length > 0} sub="Ưu tiên xử lý trong 24h" />
                <Kpi icon={ShoppingBag} label="Doanh thu" value={formatCurrency(revenue)} />
            </div>

            <div className="bg-card border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Lô hàng chờ duyệt</h3>
                    <Link to="/admin/approvals" className="text-xs text-primary flex items-center gap-1">Tất cả <ArrowRight className="w-3 h-3" /></Link>
                </div>
                <div className="space-y-2">
                    {pending.slice(0, 6).map((b) => (
                        <Link key={b.id} to={`/admin/approvals/${b.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                            {b?.image && <img src={b.image}className="w-10 h-10 rounded-lg object-cover" alt="" />}
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{b.product_name}</div>
                                <div className="text-xs text-muted-foreground truncate">{b.farm_name} · {b.batch_code}</div>
                            </div>
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Chờ duyệt</span>
                        </Link>
                    ))}
                    {pending.length === 0 && <p className="text-sm text-muted-foreground">Không có lô hàng nào đang chờ duyệt.</p>}
                </div>
            </div>

            <div className="bg-card border rounded-2xl p-5">
                <h3 className="font-semibold mb-3">Đơn hàng gần đây</h3>
                <table className="w-full text-sm">
                    <thead className="text-xs uppercase text-muted-foreground">
                    <tr><th className="text-left pb-2">Mã đơn</th><th className="text-left pb-2">Khách</th><th className="text-left pb-2">Ngày</th><th className="text-right pb-2">Giá trị</th></tr>
                    </thead>
                    <tbody>
                    {orders?.slice(0, 8).map((o) => (
                        <tr key={o.id} className="border-t">
                            <td className="py-2 font-mono">#{o.id}</td>
                            <td>{o.receiver_name}</td>
                            <td>{formatDate(o.created_at)}</td>
                            <td className="text-right font-semibold">{formatCurrency(o.total_price)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Kpi({ icon: Icon, label, value, sub, highlight }: any) {
    return (
        <div className={`bg-card border rounded-2xl p-5 ${highlight ? "ring-2 ring-amber-400/40" : ""}`}>
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center"><Icon className="w-5 h-5" /></div>
                <div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-xl font-bold">{value}</div>
                </div>
            </div>
            {sub && <div className="text-xs text-muted-foreground mt-3">{sub}</div>}
        </div>
    );
}