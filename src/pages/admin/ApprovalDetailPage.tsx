import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { QRCode } from "@/components/common/QRCode";
import { buildTraceUrl } from "@/lib/trace";
import { useFetch } from "@/hooks/useFetch";
import { approvalService, CURRENT_ADMIN_ID } from "@/services/approvalService";
import { TrustBadge } from "@/components/common/TrustBadge";
import { formatDate } from "@/lib/utils";
import type { TrustLevel } from "@/types/batch";

export default function ApprovalDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: batch, loading, refetch } = useFetch(() => approvalService.getById(Number(id)), [id]);
    const [note, setNote] = useState("");
    const [trust, setTrust] = useState<TrustLevel>("Low");
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [checks, setChecks] = useState([false, false, false]);
    if (loading) return <p className="text-muted-foreground">Đang tải...</p>;
    if (!batch) return <p className="text-muted-foreground">Không tìm thấy lô hàng.</p>;

    const reject = async () => {
        setSubmitting(true);
        setErrorMsg(null);
        try {
            await approvalService.reject(batch.id, CURRENT_ADMIN_ID, note || "Hồ sơ chưa đạt yêu cầu");
            navigate("/admin/approvals");
        } catch (err: any) {
            setErrorMsg(err?.message ?? "Có lỗi xảy ra khi từ chối lô hàng.");
        } finally {
            setSubmitting(false);
        }
    };

    const approve = async () => {
        setSubmitting(true);
        setErrorMsg(null);
        try {
            await approvalService.approve(batch.id, CURRENT_ADMIN_ID, trust, note);
            refetch(); // tải lại để lấy batch mới nhất (đã có barcode) thay vì điều hướng đi
        } catch (err: any) {
            setErrorMsg(err?.message ?? "Có lỗi xảy ra khi duyệt lô hàng.");
        } finally {
            setSubmitting(false);
        }
    };

    const copyCode = async () => {
        if (!batch.barcode) return;
        await navigator.clipboard.writeText(batch.barcode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isApproved = batch.approval_status === "Approved" && !!batch.barcode;

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
                <div className="bg-card border rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                        {batch.image ? (
                            <img src={batch.image} className="w-24 h-24 rounded-xl object-cover" alt=""/>) : (
                            <div
                                className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                Chưa có ảnh
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xl font-bold">{batch.product_name}</h2>
                                <TrustBadge level={batch.trust_level} size="sm"/>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono mt-1">
                                {batch.barcode ?? "Chưa duyệt"}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">{batch.farm_name}</div>
                            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                                <Info label="Gieo" value={formatDate(batch.planting_date)}/>
                                <Info label="Thu hoạch" value={formatDate(batch.harvest_date)}/>
                                <Info label="Số lượng" value={`${batch.quantity}kg`}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-card border rounded-2xl p-5">
                    <h3 className="font-semibold mb-3">
                        Ảnh minh chứng ({batch.images.length})
                    </h3>
                    {batch.images.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Lô hàng chưa có ảnh minh chứng.</p>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {batch.images.map((url: string, i: number) => (
                                <button key={i} type="button" onClick={() => setPreview(url)}>
                                    <img
                                        src={url}
                                        alt={`Ảnh minh chứng ${i + 1}`}
                                        className="w-full aspect-square rounded-lg object-cover hover:opacity-80 transition"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                    {preview && (
                        <div
                            className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4"
                            onClick={() => setPreview(null)}
                        >
                            <img src={preview} alt="" className="max-h-[90vh] max-w-full rounded-xl" />
                        </div>
                    )}
                </div>
                <div className="bg-card border rounded-2xl p-5">
                    <h3 className="font-semibold mb-3">Checklist kiểm duyệt</h3>
                    <ul className="space-y-2 text-sm">
                        {[
                            "Ảnh minh chứng khớp loại nông sản",
                            "Đủ mốc thời gian: gieo trồng → chăm sóc → thu hoạch",
                            "Giá bán hợp lý so với thị trường",
                        ].map((label, i) => (
                            <li key={i}>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={checks[i]}
                                        onChange={() =>
                                            setChecks((c) => c.map((v, idx) => (idx === i ? !v : v)))
                                        }
                                    />
                                    {label}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Panel mã QR — hiện bất cứ khi nào batch đã có barcode, không chỉ ngay lúc vừa duyệt */}
                {isApproved && (
                    <div className="bg-card border rounded-2xl p-5 text-center space-y-4">
                        <h3 className="font-semibold">Mã QR truy xuất nguồn gốc</h3>
                        <div className="flex justify-center">
                            <div className="p-4 bg-white rounded-xl border inline-block">
                                <QRCode value={buildTraceUrl(batch.barcode ?? "")} size={180}/>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                            <code className="text-xs bg-muted px-3 py-1.5 rounded-lg font-mono">{batch.barcode}</code>
                            <button onClick={() => void copyCode()} className="text-xs text-primary font-medium">
                                {copied ? "Đã sao chép ✓" : "Sao chép"}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Người mua quét mã này rồi nhập vào trang tra cứu để xem thông tin truy xuất nguồn gốc.
                        </p>
                    </div>
                )}
            </div>

            <aside className="space-y-4">
                {batch.approval_status === "Pending" ? (
                    <div className="bg-card border rounded-2xl p-5">
                        <h3 className="font-semibold mb-3">Gán cấp độ tin cậy</h3>
                        <select value={trust} onChange={(e) => setTrust(e.target.value as TrustLevel)}
                                className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                            <option value="Low">Cấp 1 — Đã xác minh cơ bản</option>
                            <option value="Medium">Cấp 2 — Nhật ký canh tác đầy đủ</option>
                            <option value="High">Cấp 3 — Chứng nhận & Xác minh toàn diện</option>
                        </select>
                        <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú duyệt / lý do từ chối..."
                                  className="w-full mt-3 px-3 py-2 rounded-lg border bg-background text-sm" />
                        {errorMsg && <p className="text-xs text-destructive mt-2">{errorMsg}</p>}
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => void reject()} disabled={submitting} className="flex-1 border-2 border-destructive text-destructive py-2.5 rounded-xl font-semibold hover:bg-destructive/5 disabled:opacity-50">
                                Từ chối
                            </button>
                            <button onClick={() => void approve()} disabled={submitting} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold disabled:opacity-50">
                                Duyệt & tạo QR
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-card border rounded-2xl p-5 text-center">
                        <p className="text-sm text-muted-foreground">
                            Lô hàng này đã được xử lý — trạng thái hiện tại:{" "}
                            <b>{batch.approval_status === "Approved" ? "Đã duyệt" : "Đã từ chối"}</b>
                        </p>
                    </div>
                )}
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