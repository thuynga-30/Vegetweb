import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { batchService } from "@/services/batchService";
import { Plus, Trash2, UploadCloud, Award, ShieldCheck, Shield } from "lucide-react";
import type { TrustLevel } from "@/types/batch";

interface LogRow { log_date: string; activity: string; description: string }

const TRUST_PREVIEW: Record<TrustLevel, { title: string; desc: string; icon: typeof Shield; cls: string; hint: string }> = {
    Low: {
        title: "Cấp 1 — Cơ bản", desc: "Thông tin lô hàng tối thiểu",
        icon: Shield, cls: "bg-[color:var(--trust-bronze)]/15 text-[color:var(--trust-bronze)]",
        hint: "Bổ sung nhật ký canh tác để đạt Cấp 2.",
    },
    Medium: {
        title: "Cấp 2 — Bạc", desc: "Có nhật ký canh tác đầy đủ",
        icon: ShieldCheck, cls: "bg-slate-400/15 text-slate-600",
        hint: "Bổ sung chứng nhận và ảnh thực địa để đạt Cấp 3.",
    },
    High: {
        title: "Cấp 3 — Vàng", desc: "Có nhật ký, ảnh thực địa đầy đủ",
        icon: Award, cls: "bg-[color:var(--trust-gold)]/15 text-[color:var(--trust-gold)]",
        hint: "Lô hàng đủ điều kiện cấp độ tin cậy cao nhất!",
    },
};

export default function BatchCreatePage() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState({ product_name: "", planting_date: "", harvest_date: "", quantity: "", price: "" });
    const [logs, setLogs] = useState<LogRow[]>([{ log_date: "", activity: "", description: "" }]);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<"draft" | "submit" | null>(null);

    const addLog = () => setLogs((l) => [...l, { log_date: "", activity: "", description: "" }]);
    const removeLog = (i: number) => setLogs((l) => l.filter((_, idx) => idx !== i));
    const updateLog = (i: number, key: keyof LogRow, value: string) =>
        setLogs((l) => l.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));

    const handleFile = (file?: File) => {
        if (!file) return;
        setImagePreview(URL.createObjectURL(file));
    };

    const filledLogs = logs.filter((l) => l.log_date && l.activity).length;
    const trustLevel: TrustLevel = useMemo(() => {
        if (imagePreview && filledLogs >= 2) return "High";
        if (filledLogs >= 1) return "Medium";
        return "Low";
    }, [imagePreview, filledLogs]);
    const preview = TRUST_PREVIEW[trustLevel];
    const PreviewIcon = preview.icon;

    const submit = async (mode: "draft" | "submit") => {
        setError("");
        if (mode === "draft") {
            // Demo: lưu nháp chỉ giữ lại trên form, chưa gửi lên hệ thống — thực tế có thể lưu vào API riêng /batches/draft
            alert("Đã lưu nháp lô hàng (chỉ lưu tạm trên trình duyệt, chưa gửi admin duyệt).");
            return;
        }
        setLoading(mode);
        try {
            await batchService.create({
                product_name: form.product_name,
                planting_date: form.planting_date,
                harvest_date: form.harvest_date,
                quantity: Number(form.quantity),
                price: form.price ? Number(form.price) : undefined,
                image: imagePreview || undefined,
                logs: logs.filter((l) => l.activity && l.log_date),
            });
            navigate("/seller/batches");
        } catch (err: any) {
            setError(err?.message ?? "Tạo lô hàng thất bại");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div>
            {error && <p className="text-sm text-destructive mb-4">{error}</p>}
            <div className="grid md:grid-cols-[1fr_320px] gap-5 items-start">
                {/* Cột trái: form */}
                <div className="space-y-5">
                    <div className="bg-card border rounded-2xl p-6 space-y-4">
                        <h2 className="font-semibold">Thông tin lô hàng</h2>
                        <div>
                            <label className="text-sm font-medium">Tên sản phẩm</label>
                            <input
                                required value={form.product_name}
                                onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                                placeholder="VD: Xà lách Romaine Đà Lạt"
                                className="w-full mt-1 px-3 py-2 rounded-lg border bg-background"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Ngày gieo trồng</label>
                                <input type="date" required value={form.planting_date}
                                       onChange={(e) => setForm({ ...form, planting_date: e.target.value })}
                                       className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Ngày thu hoạch (dự kiến)</label>
                                <input type="date" required value={form.harvest_date}
                                       onChange={(e) => setForm({ ...form, harvest_date: e.target.value })}
                                       className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Sản lượng (kg)</label>
                                <input type="number" required value={form.quantity}
                                       onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                       className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Giá bán (VNĐ/kg)</label>
                                <input type="number" required value={form.price}
                                       onChange={(e) => setForm({ ...form, price: e.target.value })}
                                       className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Ảnh lô hàng</label>
                            <label
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
                                className="mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-10 text-sm text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition overflow-hidden relative"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <UploadCloud className="w-6 h-6" />
                                        Kéo thả ảnh hoặc nhấn để tải lên
                                    </>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                                       onChange={(e) => handleFile(e.target.files?.[0])} />
                            </label>
                        </div>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold">Nhật ký canh tác (timeline)</h2>
                            <button type="button" onClick={addLog} className="text-sm text-primary flex items-center gap-1">
                                <Plus className="w-4 h-4" /> Thêm mục
                            </button>
                        </div>
                        {logs.map((l, i) => (
                            <div key={i} className="grid grid-cols-[140px_1fr_1fr_auto] gap-2 items-start">
                                <input type="date" value={l.log_date} onChange={(e) => updateLog(i, "log_date", e.target.value)}
                                       className="px-2 py-2 rounded-lg border bg-background text-sm" />
                                <input placeholder="Gieo hạt" value={l.activity} onChange={(e) => updateLog(i, "activity", e.target.value)}
                                       className="px-2 py-2 rounded-lg border bg-background text-sm" />
                                <input placeholder="Mô tả" value={l.description} onChange={(e) => updateLog(i, "description", e.target.value)}
                                       className="px-2 py-2 rounded-lg border bg-background text-sm" />
                                <button type="button" onClick={() => removeLog(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <div className="bg-amber-50 text-amber-800 text-xs rounded-lg px-3 py-2.5">
                            💡 Nhật ký càng chi tiết → Admin đánh giá cấp độ tin cậy càng cao (Vàng nếu có nhật ký đầy đủ + chứng nhận + ảnh thực địa).
                        </div>
                    </div>
                </div>

                {/* Cột phải: preview cấp độ tin cậy + hướng dẫn + hành động */}
                <div className="space-y-5">
                    <div className="bg-card border rounded-2xl p-6 text-center">
                        <h3 className="font-semibold mb-3">Cấp độ tin cậy dự kiến</h3>
                        <div className={`w-14 h-14 rounded-2xl mx-auto grid place-items-center ${preview.cls}`}>
                            <PreviewIcon className="w-7 h-7" />
                        </div>
                        <div className="font-bold mt-3">{preview.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{preview.desc}</div>
                        <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                            {preview.hint.split(/(\bchứng nhận\b|\bảnh thực địa\b)/i).map((part, idx) =>
                                /chứng nhận|ảnh thực địa/i.test(part) ? <b key={idx}>{part}</b> : part
                            )}
                        </div>
                    </div>

                    <div className="bg-card border rounded-2xl p-6">
                        <h3 className="font-semibold mb-3">Sau khi gửi</h3>
                        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Admin xem xét trong 24h</li>
                            <li>Nhận thông báo duyệt/từ chối</li>
                            <li>Lô hàng lên sàn + tự sinh mã QR</li>
                        </ol>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button" onClick={() => submit("draft")} disabled={loading !== null}
                            className="flex-1 border-2 py-3 rounded-xl font-semibold hover:bg-muted disabled:opacity-50"
                        >
                            Lưu nháp
                        </button>
                        <button
                            type="button" onClick={() => submit("submit")} disabled={loading !== null}
                            className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold disabled:opacity-50"
                        >
                            {loading === "submit" ? "Đang gửi..." : "Gửi duyệt"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}