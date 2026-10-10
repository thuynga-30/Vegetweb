import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { batchService } from "@/services/batchService";
import { TrustBadge } from "@/components/common/TrustBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Plus, QrCode } from "lucide-react";

export default function BatchListPage() {
    const { data: batches, loading } = useFetch(() => batchService.getMyBatches(), []);

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-muted-foreground">Quản lý toàn bộ lô hàng của trang trại — từ nháp, chờ duyệt đến đang bán.</p>
                <Link to="/seller/batches/new" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm">
                    <Plus className="w-4 h-4" /> Tạo lô hàng mới
                </Link>
            </div>

            <div className="bg-card border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                        <th className="text-left p-3">Sản phẩm</th>
                        <th className="text-left p-3">Mã lô</th>
                        <th className="text-left p-3">Ngày thu hoạch</th>
                        <th className="text-left p-3">Còn lại</th>
                        <th className="text-left p-3">Cấp độ tin cậy</th>
                        <th className="text-left p-3">Trạng thái</th>
                        <th className="text-right p-3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {batches?.map((b) => (
                        <tr key={b.id} className="border-t hover:bg-muted/30">
                            <td className="p-3">
                                <div className="flex items-center gap-3">
                                    {b?.image && <img src={b.image} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                                    <div className="font-medium">{b.product_name}</div>
                                </div>
                            </td>
                            <td className="p-3 font-mono text-xs">{b.barcode ?? "—"}</td>
                            <td className="p-3">{formatDate(b.harvest_date)}</td>
                            <td className="p-3">{b.quantity} kg</td>
                            <td className="p-3"><TrustBadge level={b.trust_level} size="sm" /></td>
                            <td className="p-3"><StatusBadge status={b.approval_status} /></td>
                            <td className="p-3 text-right">
                                <div className="inline-flex gap-1">
                                    <button className="p-1.5 hover:bg-muted rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                            title={b.barcode ? "Mã QR" : "Chưa có mã QR"}
                                            disabled={!b.barcode}
                                    >
                                        <QrCode className="w-4 h-4" />
                                    </button>

                                    <Link to={`/seller/batches/${b.id}`} className="px-3 py-1 rounded bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20">
                                        Chi tiết
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {!loading && (!batches || batches.length === 0) && (
                    <p className="text-sm text-muted-foreground p-6 text-center">Chưa có lô hàng nào — bấm "Tạo lô hàng mới" để bắt đầu.</p>
                )}
            </div>
        </div>
    );
}