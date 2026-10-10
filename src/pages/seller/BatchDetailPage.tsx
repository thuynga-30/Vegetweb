import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { batchService } from "@/services/batchService";
import { TrustBadge } from "@/components/common/TrustBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { QRCode } from "@/components/common/QRCode";
import { buildTraceUrl } from "@/lib/trace";
import { formatDate } from "@/lib/utils";
import { Plus, Download, Printer, X, Loader2 } from "lucide-react";


export default function BatchDetailPage() {
    const { id } = useParams();
    const batchId = Number(id);
    const { data: batch, loading } = useFetch(() => batchService.getById(batchId), [id]);
    const { data: logs, loading: logsLoading, refetch: refetchLogs } = useFetch(() => batchService.getLogs(batchId), [id]);

    const [showForm, setShowForm] = useState(false);
    const [logDate, setLogDate] = useState("");
    const [activity, setActivity] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (loading) return <p className="text-muted-foreground">Đang tải...</p>;
    if (!batch) return <p className="text-muted-foreground">Không tìm thấy lô hàng.</p>;

    const resetForm = () => {
        setLogDate("");
        setActivity("");
        setDescription("");
        setImage("");
        setError("");
    };

    const submitLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logDate || !activity.trim()) {
            setError("Vui lòng nhập ngày và hoạt động canh tác.");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            await batchService.addLog(batchId, {
                log_date: logDate,
                activity: activity.trim(),
                description: description.trim() || undefined,
                image: image.trim() || undefined,
            });
            resetForm();
            setShowForm(false);
            refetchLogs();
        } catch (err: any) {
            const m = err?.message;
            setError(Array.isArray(m) ? m.join(", ") : m ?? "Không thể thêm mục nhật ký, vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
                <div className="bg-card border rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                        {batch.image ? (
                            <img
                                src={batch.image}
                                className="w-24 h-24 rounded-xl object-cover"
                                alt=""
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                Chưa có ảnh
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xl font-bold">{batch.product_name}</h2>
                                <StatusBadge status={batch.approval_status} />
                                <TrustBadge level={batch.trust_level} size="sm" />
                            </div>
                            <div className="text-xs text-muted-foreground font-mono mt-1">
                                {batch.barcode ?? "Chưa có mã (chờ admin duyệt)"}
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                                <Info label="Gieo" value={formatDate(batch.planting_date)} />
                                <Info label="Thu hoạch" value={formatDate(batch.harvest_date)} />
                                <Info label="Còn lại" value={`${batch.quantity}kg`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Nhật ký canh tác</h3>
                        <button
                            onClick={() => { setShowForm((v) => !v); if (showForm) resetForm(); }}
                            className="text-sm text-primary flex items-center gap-1 hover:underline"
                        >
                            {showForm ? <><X className="w-4 h-4" /> Hủy</> : <><Plus className="w-4 h-4" /> Thêm mục</>}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={submitLog} className="mb-5 p-4 rounded-xl border bg-muted/20 space-y-3">
                            <div className="grid sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-muted-foreground">Ngày *</label>
                                    <input
                                        type="date"
                                        value={logDate}
                                        onChange={(e) => setLogDate(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">Hoạt động *</label>
                                    <input
                                        value={activity}
                                        onChange={(e) => setActivity(e.target.value)}
                                        placeholder="VD: Bón phân hữu cơ, tưới nước..."
                                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">Mô tả</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                    placeholder="Chi tiết về hoạt động canh tác..."
                                    className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">Ảnh (URL)</label>
                                <input
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm"
                                />
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                            >
                                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Lưu mục nhật ký
                            </button>
                        </form>
                    )}

                    {logsLoading ? (
                        <p className="text-sm text-muted-foreground">Đang tải nhật ký...</p>
                    ) : logs && logs.length > 0 ? (
                        <ol className="relative border-l-2 border-primary/20 ml-2 space-y-5">
                            {logs.map((l) => (
                                <li key={l.id} className="ml-5">
                                    <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20" />
                                    <div className="text-xs text-muted-foreground">{formatDate(l.log_date)}</div>
                                    <div className="font-medium">{l.activity}</div>
                                    {l.description && <div className="text-sm text-muted-foreground">{l.description}</div>}
                                    {l.image && <img src={l.image} alt="" className="mt-2 rounded-lg w-40 h-24 object-cover" />}
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-sm text-muted-foreground">Chưa có mục nhật ký canh tác nào. Hãy thêm mục đầu tiên.</p>
                    )}
                </div>
            </div>
            {/* qr */}
            <aside className="space-y-4">
                <div className="bg-card border rounded-2xl p-5 text-center">
                    <h3 className="font-semibold mb-3">Mã QR truy xuất</h3>
                    {batch.approval_status === "Approved" && batch.barcode ? (
                        <>
                            <div className="inline-block">
                                <QRCode value={buildTraceUrl(batch.barcode)} />
                            </div>
                            <div className="font-mono text-xs mt-2">{batch.barcode}</div>
                            <div className="mt-4 flex gap-2">
                                <button className="flex-1 border rounded-lg py-2 text-sm flex items-center justify-center gap-1"><Download className="w-4 h-4" /> Tải</button>
                                <button className="flex-1 border rounded-lg py-2 text-sm flex items-center justify-center gap-1"><Printer className="w-4 h-4" /> In tem</button>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {batch.approval_status === "Pending"
                                ? "QR sẽ xuất hiện sau khi admin duyệt lô hàng."
                                : "Lô hàng đã bị từ chối, không có mã QR."}
                        </p>
                    )}
                </div>
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