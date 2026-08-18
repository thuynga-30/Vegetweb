import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { batchService } from "@/services/batchService";
import { orderService } from "@/services/orderService";
import { StatCard } from "@/components/common/StatCard";
import { TrustBadge } from "@/components/common/TrustBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { Package, ShoppingBag, CheckSquare, TrendingUp, ArrowRight } from "lucide-react";

export default function SellerOverviewPage() {
    const { data: batches } = useFetch(() => batchService.getMyBatches(), []);
    const { data: orders } = useFetch(() => orderService.getSellerOrders(), []);

    const pending = batches?.filter((b) => b.approval_status === "Pending") ?? [];
    const onSale = batches?.filter((b) => b.approval_status === "Approved") ?? [];
    const revenue = orders?.reduce((s, o) => s + o.total_price, 0) ?? 0;

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
                <StatCard icon={<Package className="w-5 h-5" />} label="Lô hàng đang bán" value={String(onSale.length)} />
                <StatCard icon={<CheckSquare className="w-5 h-5" />} label="Chờ kiểm duyệt" value={String(pending.length)} highlight={pending.length > 0} sub="Ưu tiên bổ sung minh chứng" />
                <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Đơn hàng" value={String(orders?.length ?? 0)} />
                <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Doanh thu" value={formatCurrency(revenue)} />
            </div>

            <div className="bg-card border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Lô hàng gần đây</h3>
                    <Link to="/seller/batches" className="text-xs text-primary flex items-center gap-1">Tất cả <ArrowRight className="w-3 h-3" /></Link>
                </div>
                <div className="space-y-2">
                    {batches?.slice(0, 5).map((b) => (
                        <Link key={b.id} to={`/seller/batches/${b.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                            <img src={b.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{b.product_name}</div>
                                <div className="text-xs text-muted-foreground truncate">{b.batch_code}</div>
                            </div>
                            <TrustBadge level={b.trust_level} size="sm" />
                        </Link>
                    ))}
                    {(!batches || batches.length === 0) && <p className="text-sm text-muted-foreground">Chưa có lô hàng nào.</p>}
                </div>
            </div>

            <div className="bg-card border rounded-2xl p-5">
                <h3 className="font-semibold mb-4">Đơn hàng gần đây</h3>
                <div className="space-y-2">
                    {orders?.slice(0, 5).map((o) => (
                        <div key={o.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted text-sm">
                            <span>#{o.id} · {o.receiver_name}</span>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={o.status} />
                                <span className="font-semibold">{formatCurrency(o.total_price)}</span>
                            </div>
                        </div>
                    ))}
                    {(!orders || orders.length === 0) && <p className="text-sm text-muted-foreground">Chưa có đơn hàng nào.</p>}
                </div>
            </div>
        </div>
    );
}
