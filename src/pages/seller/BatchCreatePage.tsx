import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { batchService } from "@/services/batchService";
import { Plus, Trash2, UploadCloud, X, Award, ShieldCheck, Shield } from "lucide-react";
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

// Backend có thể trả message dạng chuỗi hoặc mảng (lỗi validate)
const errText = (err: any, fallback: string) => {
    const m = err?.message;
    if (Array.isArray(m)) return m.join(", ");
    return m ?? fallback;
};

const OTHER = "__other__";

export default function BatchCreatePage() {
    const navigate = useNavigate();
    const { data: products, refetch: refetchProducts } = useFetch(() => productService.getMyProducts(), []);
    const { data: categories } = useFetch(() => categoryService.getAll(), []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        product_id: "",
        planting_date: "",
        harvest_date: "",
        quantity: "",
        price: "",
    });
    const [logs, setLogs] = useState<LogRow[]>([{ log_date: "", activity: "", description: "" }]);
    const MAX_IMAGES = 10;
    const MAX_SIZE = 5 * 1024 * 1024; // khớp giới hạn 5MB ở backend
    const [newProduct, setNewProduct] = useState({ name: "", category_id: "" });
    const [images, setImages] = useState<{ file: File; url: string }[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<"draft" | "submit" | null>(null);

    const addLog = () => setLogs((l) => [...l, { log_date: "", activity: "", description: "" }]);
    const removeLog = (i: number) => setLogs((l) => l.filter((_, idx) => idx !== i));
    const updateLog = (i: number, key: keyof LogRow, value: string) =>
        setLogs((l) => l.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));

    const addFiles = (list?: FileList | null) => {
        if (!list || list.length === 0) return;
        const picked = Array.from(list).filter((f) => f.type.startsWith("image/"));
        const tooBig = picked.filter((f) => f.size > MAX_SIZE);
        const ok = picked.filter((f) => f.size <= MAX_SIZE);
        setImages((prev) => {
            const room = MAX_IMAGES - prev.length;
            if (ok.length > room) setError(`Tối đa ${MAX_IMAGES} ảnh cho mỗi lô.`);
            else if (tooBig.length) setError("Một số ảnh vượt quá 5MB nên đã bị bỏ qua.");
            else setError("");
            return [...prev, ...ok.slice(0, Math.max(room, 0)).map((file) => ({ file, url: URL.createObjectURL(file) }))];
        });
        if (fileInputRef.current) fileInputRef.current.value = ""; // cho phép chọn lại cùng file
    };

    const removeImage = (i: number) =>
        setImages((prev) => {
            URL.revokeObjectURL(prev[i].url);
            return prev.filter((_, idx) => idx !== i);
        });

    const filledLogs = logs.filter((l) => l.log_date && l.activity).length;
    const trustLevel: TrustLevel = useMemo(() => {
        if (images.length > 0 && filledLogs >= 2) return "High";
        if (filledLogs >= 1) return "Medium";
        return "Low";
    }, [images.length, filledLogs]);
    const preview = TRUST_PREVIEW[trustLevel];
    const PreviewIcon = preview.icon;

    const submit = async (mode: "draft" | "submit") => {
        setError("");

        if (mode === "draft") {
            alert("Đã lưu nháp lô hàng (chỉ lưu tạm trên trình duyệt, chưa gửi admin duyệt).");
            return;
        }

        const isOther = form.product_id === OTHER;
        if (!form.product_id) {
            setError("Vui lòng chọn sản phẩm.");
            return;
        }
        if (isOther) {
            if (!newProduct.name.trim()) {
                setError("Vui lòng nhập tên sản phẩm mới.");
                return;
            }
            if (!newProduct.category_id) {
                setError("Vui lòng chọn danh mục cho sản phẩm mới.");
                return;
            }
            if (!form.price || Number(form.price) <= 0) {
                setError("Vui lòng nhập giá bán cho sản phẩm mới.");
                return;
            }
        }
        if (!form.harvest_date) {
            setError("Vui lòng chọn ngày thu hoạch.");
            return;
        }
        const qty = Number(form.quantity);
        if (!Number.isInteger(qty) || qty < 1) {
            setError("Sản lượng phải là số nguyên lớn hơn 0.");
            return;
        }

        setLoading(mode);

        try {
            // Sản phẩm khác: tạo sản phẩm trước, rồi dùng id vừa tạo cho lô hàng
            let productId = Number(form.product_id);
            if (isOther) {
                const p = await productService.create({
                    name: newProduct.name.trim(),
                    category_id: Number(newProduct.category_id),
                    price: Number(form.price),
                });
                productId = p.id;
                // Nếu bước tạo lô bên dưới lỗi, bấm gửi lại sẽ dùng sản phẩm này, không tạo trùng
                setForm((f) => ({ ...f, product_id: String(p.id) }));
                setNewProduct({ name: "", category_id: "" });
                refetchProducts();
            }

            const created = await batchService.create({
                productId,
                plantingDate: form.planting_date || undefined,
                harvestDate: form.harvest_date,
                quantity: qty,
                cultivationLogs: logs
                    .filter((l) => l.activity && l.log_date)
                    .map((l) => ({
                        activity: l.activity,
                        description: l.description || undefined,
                        logDate: l.log_date,
                    })),
            });

            // Gửi ảnh thật sau khi tạo lô (field "files" khớp FilesInterceptor ở backend)
            if (images.length > 0) {
                const fd = new FormData();
                images.forEach((img) => fd.append("files", img.file));
                try {
                    await batchService.uploadImages(created.id, fd);
                } catch {
                    // Lô đã tạo xong; có thể tải lại ảnh sau
                }
            }

            navigate("/seller/batches");
        } catch (err: any) {
            setError(errText(err, "Tạo lô hàng thất bại"));
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
                            <label className="text-sm font-medium">Sản phẩm</label>
                            <select
                                required value={form.product_id}
                                onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-lg border bg-background"
                            >
                                <option value="">— Chọn sản phẩm —</option>
                                {products?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                <option value={OTHER}>+ Sản phẩm khác (nhập tên mới)</option>
                            </select>

                            {form.product_id === OTHER && (
                                <div className="mt-3 p-4 rounded-xl border bg-muted/20 grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-muted-foreground">Tên sản phẩm mới *</label>
                                        <input
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            placeholder="VD: Cà chua bi"
                                            className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground">Danh mục *</label>
                                        <select
                                            value={newProduct.category_id}
                                            onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm"
                                        >
                                            <option value="">— Chọn danh mục —</option>
                                            {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <p className="sm:col-span-2 text-xs text-muted-foreground">
                                        Sản phẩm mới được tạo cùng lúc với lô hàng, giá lấy từ ô "Giá bán" bên dưới.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Ngày gieo trồng</label>
                                <input type="date" value={form.planting_date}
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
                                <input type="number" min={1} step={1} required value={form.quantity}
                                       onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                       className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Giá bán (VNĐ/kg)</label>
                                <input type="number" value={form.price}
                                       onChange={(e) => setForm({ ...form, price: e.target.value })}
                                       className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Ảnh lô hàng ({images.length}/{MAX_IMAGES})
                            </label>
                            <label
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
                                className="mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 text-sm text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition"
                            >
                                <UploadCloud className="w-6 h-6" />
                                Kéo thả hoặc nhấn để chọn nhiều ảnh
                                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                                       onChange={(e) => addFiles(e.target.files)} />
                            </label>

                            {images.length > 0 && (
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-3">
                                    {images.map((img, i) => (
                                        <div key={img.url} className="relative group">
                                            <img src={img.url} alt={`Ảnh ${i + 1}`}
                                                 className="w-full aspect-square rounded-lg object-cover" />
                                            <button type="button" onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition"
                                                    title="Xóa ảnh">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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