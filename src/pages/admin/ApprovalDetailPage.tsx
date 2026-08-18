import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { batchService } from "@/services/batchService";
import { TrustBadge } from "@/components/common/TrustBadge";
import { formatDate } from "@/lib/utils";
import type { TrustLevel } from "@/types/batch";

export default function ApprovalDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: batch, loading } = useFetch(() => batchService.getById(Number(id)), [id]);
    const [note, setNote] = useState("");
    const [trust, setTrust] = useState<TrustLevel>("Low");
    const [submitting, setSubmitting] = useState(false);

    if (loading) return <p className="text-muted-foreground">Đang tải...</p>;
    if (!batch) return <p className="text-muted-foreground">Không tìm thấy lô hàng.</p>;

    const reject = async () => {
        setSubmitting(true);
        try {
            await batchService.reject(batch.id, note || "Hồ sơ chưa đạt yêu cầu");
            navigate("/admin/approvals");
        } finally {
            setSubmitting(false);
        }
    };

    const approve = async () => {
        setSubmitting(true);
        try {
            await batchService.update(batch.id, { trust_level: trust });
            await batchService.approve(batch.id, note);
            navigate("/admin/approvals");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
                <div className="bg-card border rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                        <img src={batch.image} className="w-24 h-24 rounded-xl object-cover" alt="" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xl font-bold">{batch.product_name}</h2>
                                <TrustBadge level={batch.trust_level} size="sm" />
                            </div>
                            <div className="text-xs text-muted-foreground font-mono mt-1">{batch.batch_code}</div>
                            <div className="text-sm text-muted-foreground mt-1">{batch.farm_name}</div>
                            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                                <Info label="Gieo" value={formatDate(batch.planting_date)} />
                                <Info label="Thu hoạch" value={formatDate(batch.harvest_date)} />
                                <Info label="Số lượng" value={`${batch.quantity}kg`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-2xl p-5">
                    <h3 className="font-semibold mb-3">Checklist kiểm duyệt</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">☑ Ảnh minh chứng khớp loại nông sản</li>
                        <li className="flex items-center gap-2">☑ Đủ mốc thời gian: gieo trồng → chăm sóc → thu hoạch</li>
                        <li className="flex items-center gap-2">☑ Giá bán hợp lý so với thị trường</li>
                    </ul>
                </div>
            </div>

            <aside className="space-y-4">
                <div className="bg-card border rounded-2xl p-5">
                    <h3 className="font-semibold mb-3">Gán cấp độ tin cậy</h3>
                    <select value={trust} onChange={(e) => setTrust(e.target.value as TrustLevel)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                        <option value="Low">Cấp 1 — Đã xác minh cơ bản</option>
                        <option value="Medium">Cấp 2 — Nhật ký canh tác đầy đủ</option>
                        <option value="High">Cấp 3 — Chứng nhận & Xác minh toàn diện</option>
                    </select>
                    <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú duyệt / lý do từ chối..."
                              className="w-full mt-3 px-3 py-2 rounded-lg border bg-background text-sm" />
                    <div className="flex gap-2 mt-4">
                        <button onClick={reject} disabled={submitting} className="flex-1 border-2 border-destructive text-destructive py-2.5 rounded-xl font-semibold hover:bg-destructive/5 disabled:opacity-50">
                            Từ chối
                        </button>
                        <button onClick={approve} disabled={submitting} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold disabled:opacity-50">
                            Duyệt & tạo QR
                        </button>
                    </div>
                </div>
                <Link to="/admin/approvals" className="block text-center text-sm text-muted-foreground hover:text-primary">← Danh sách chờ duyệt</Link>
            </aside>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-2 rounded-lg bg-muted/40">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="font-medium text-sm">{value}</div>
        </div>
    );
}
