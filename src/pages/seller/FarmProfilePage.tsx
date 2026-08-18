import { useEffect, useRef, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { farmService } from "@/services/farmService";
import type { Certification } from "@/types/farm";
import { MapPin, Save, Award, ShieldCheck, TrendingUp, Upload, X } from "lucide-react";

export default function FarmProfilePage() {
    const { data: farm, loading, refetch } = useFetch(() => farmService.getMyFarm(), []);

    const [form, setForm] = useState({
        farm_name: "", owner_name: "", address: "", description: "",
        image: "", area_ha: "", farming_method: "",
    });
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [showCertForm, setShowCertForm] = useState(false);
    const [newCertName, setNewCertName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (farm) {
            setForm({
                farm_name: farm.farm_name ?? "",
                owner_name: farm.owner_name ?? "",
                address: farm.address ?? "",
                description: farm.description ?? "",
                image: farm.image ?? "",
                area_ha: farm.area_ha != null ? String(farm.area_ha) : "",
                farming_method: farm.farming_method ?? "",
            });
            setCertifications(farm.certifications ?? []);
        }
    }, [farm]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            await farmService.updateMyFarm({
                ...form,
                area_ha: form.area_ha ? Number(form.area_ha) : undefined,
                certifications,
            });
            setMessage("Đã lưu hồ sơ trang trại.");
            refetch();
        } catch (err: any) {
            setMessage(err?.message ?? "Lưu thất bại");
        } finally {
            setSaving(false);
        }
    };

    const addCertification = () => {
        if (!newCertName.trim()) return;
        // Chứng nhận mới tải lên sẽ ở trạng thái "Chờ xác minh" cho tới khi Admin duyệt
        setCertifications((c) => [...c, { name: newCertName.trim(), verified: false }]);
        setNewCertName("");
        setShowCertForm(false);
    };

    const removeCertification = (name: string) => {
        setCertifications((c) => c.filter((cert) => cert.name !== name));
    };

    if (loading) return <p className="text-muted-foreground">Đang tải...</p>;

    return (
        <div className="max-w-6xl mx-auto space-y-5">
            {message && (
                <div className="bg-primary/10 text-primary text-sm rounded-xl px-4 py-2.5">{message}</div>
            )}

            <div className="grid md:grid-cols-[1fr_320px] gap-5">
                {/* Cột trái: ảnh + thông tin trang trại */}
                <div className="space-y-5">
                    <div className="bg-card border rounded-2xl overflow-hidden">
                        <div className="aspect-[16/7] bg-muted relative">
                            <img src={form.image} alt={form.farm_name} className="w-full h-full object-cover" />
                            <label className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer hover:bg-black/70">
                                <Upload className="w-3.5 h-3.5" /> Đổi ảnh bìa
                                <input
                                    type="file" accept="image/*" className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setForm((f) => ({ ...f, image: URL.createObjectURL(file) }));
                                    }}
                                />
                            </label>
                        </div>
                        <div className="p-5">
                            <h2 className="text-xl font-bold">{form.farm_name || "Chưa đặt tên trang trại"}</h2>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="w-4 h-4" /> {form.address || "Chưa cập nhật địa chỉ"}
                            </div>
                            <p className="text-sm mt-2 text-muted-foreground">{form.description}</p>

                            <div className="grid grid-cols-3 gap-3 mt-4">
                                <Info label="Diện tích" value={form.area_ha ? `${form.area_ha} ha` : "—"} />
                                <Info label="Phương pháp" value={form.farming_method || "—"} />
                                <Info label="Tọa độ GPS" value={farm?.gps_lat ? `${farm.gps_lat}, ${farm.gps_lng}` : "—"} />
                            </div>
                        </div>
                    </div>

                    {/* Form chỉnh sửa */}
                    <form onSubmit={submit} className="bg-card border rounded-2xl p-6 space-y-4">
                        <h3 className="font-semibold">Chỉnh sửa thông tin</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <Field label="Tên trang trại" value={form.farm_name} onChange={(v) => setForm({ ...form, farm_name: v })} />
                            <Field label="Chủ trang trại" value={form.owner_name} onChange={(v) => setForm({ ...form, owner_name: v })} />
                        </div>
                        <Field label="Địa chỉ" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
                        <div className="grid md:grid-cols-2 gap-3">
                            <Field label="Diện tích (ha)" value={form.area_ha} onChange={(v) => setForm({ ...form, area_ha: v })} type="number" />
                            <Field label="Phương pháp canh tác" value={form.farming_method} onChange={(v) => setForm({ ...form, farming_method: v })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Mô tả</label>
                            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                      className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" />
                        </div>
                        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold disabled:opacity-50">
                            <Save className="w-4 h-4" /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </form>
                </div>

                {/* Cột phải: chứng nhận + điểm uy tín */}
                <div className="space-y-5">
                    <div className="bg-card border rounded-2xl p-5">
                        <h3 className="font-semibold flex items-center gap-2 mb-3"><Award className="w-4 h-4 text-primary" /> Chứng nhận</h3>
                        <div className="space-y-2">
                            {certifications.map((c) => (
                                <div key={c.name} className="flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm group">
                                    <span>{c.name}</span>
                                    <div className="flex items-center gap-2">
                                        {c.verified ? (
                                            <span className="flex items-center gap-1 text-xs text-primary"><ShieldCheck className="w-3.5 h-3.5" /> Đã xác minh</span>
                                        ) : (
                                            <span className="text-xs text-amber-600">Chờ xác minh</span>
                                        )}
                                        <button type="button" onClick={() => removeCertification(c.name)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {certifications.length === 0 && <p className="text-xs text-muted-foreground">Chưa có chứng nhận nào.</p>}
                        </div>

                        {showCertForm ? (
                            <div className="mt-3 space-y-2">
                                <input
                                    autoFocus value={newCertName} onChange={(e) => setNewCertName(e.target.value)}
                                    placeholder="Tên chứng nhận (VD: GlobalGAP)"
                                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                                />
                                <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="w-full text-xs" />
                                <div className="flex gap-2">
                                    <button type="button" onClick={addCertification} className="flex-1 bg-primary text-primary-foreground py-1.5 rounded-lg text-sm font-medium">Thêm</button>
                                    <button type="button" onClick={() => setShowCertForm(false)} className="flex-1 border py-1.5 rounded-lg text-sm">Hủy</button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button" onClick={() => setShowCertForm(true)}
                                className="w-full mt-3 border-2 border-dashed rounded-lg py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary flex items-center justify-center gap-2"
                            >
                                <Upload className="w-4 h-4" /> Tải chứng nhận mới
                            </button>
                        )}
                    </div>

                    <div className="bg-card border rounded-2xl p-5">
                        <h3 className="font-semibold flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-primary" /> Điểm uy tín</h3>
                        <div className="text-3xl font-bold text-primary">{farm?.trust_score ?? "—"}<span className="text-base text-muted-foreground">/5</span></div>
                        <p className="text-xs text-muted-foreground mt-1">Dựa trên đơn hàng và đánh giá của người mua</p>
                        <div className="mt-4 space-y-3">
                            {(farm?.trust_metrics ?? []).map((m) => (
                                <div key={m.label}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-muted-foreground">{m.label}</span>
                                        <span className="font-medium">{m.percent}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: `${m.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-2.5 rounded-lg bg-muted/50 text-center">
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="font-medium text-sm mt-0.5">{value}</div>
        </div>
    );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
    return (
        <div>
            <label className="text-sm font-medium">{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" />
        </div>
    );
}