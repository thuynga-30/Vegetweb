import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { orderService } from "@/services/orderService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PackageSearch } from "lucide-react";

export default function MyOrdersPage() {
    const { data: orders, loading } = useFetch(() => orderService.getMyOrders(), []);

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>

            {loading ? (
                <p className="text-muted-foreground mt-6">Đang tải...</p>
            ) : !orders || orders.length === 0 ? (
                <div className="mt-16 text-center">
                    <PackageSearch className="w-16 h-16 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
                    <Link to="/products" className="mt-5 inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold">Mua sắm ngay</Link>
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {orders.map((o) => (
                        <Link key={o.id} to={`/orders/${o.id}`} className="block bg-card border rounded-2xl p-5 hover:border-primary transition">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                    <div className="font-mono text-sm text-muted-foreground">#{o.id}</div>
                                    <div className="font-semibold">{o.receiver_name} · {o.shipping_address}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StatusBadge status={o.status} />
                                    <span className="font-bold text-primary">{formatCurrency(o.total_price)}</span>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">Đặt ngày {formatDate(o.created_at)} · {o.details?.length ?? 0} sản phẩm</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
