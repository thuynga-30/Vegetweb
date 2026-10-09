import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { farmService } from "@/services/farmService";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { MapPin, Award, TrendingUp, Check, X, ZoomIn } from "lucide-react";

const TRUST_LABEL: Record<string, { level: number; text: string }> = {
    Low: { level: 1, text: "Cấp 1 — Đã xác minh cơ bản" },
    Medium: { level: 2, text: "Cấp 2 — Nhật ký canh tác đầy đủ" },
    High: { level: 3, text: "Cấp 3 — Chứng nhận & xác minh toàn diện" },
};

export default function FarmApprovalDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: farm, loading } = useFetch(() => farmService.getByIdAdmin(Number(id)), [id]);
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<string | null>(null);

    if (loading) return <p className="text-muted-foreground">Đang tải...</p>;
    if (!farm) return <p className="text-muted-foreground">Không tìm thấy nông trại.</p>;

    const farmImages = farm.farmImages ?? farm.images ?? [];
    const certificates = farm.certificates ?? [];
    const status = farm.status ?? "pending";
    const badge = status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Pending";
    const trust = TRUST_LABEL[farm.trustLevel ?? "Low"];

    const decide = async (action: "approve" | "reject") => {
        setSubmitting(true);
        setErrorMsg(null);
        try {
            if (action === "approve") await farmService.approve(farm.id);
            else await farmService.reject(farm.id, note || "Hồ sơ chưa đủ minh chứng");
            navigate("/admin/users");
        } catch (err: any) {
            setErrorMsg(err?.message ?? "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Link to="/admin/users" className="text-sm text-muted-foreground hover:text-primary">← Danh sách người dùng</Link>

            <div className="mt-3 grid md:grid-cols-3 gap-5">
                <div className="md:col-span-2 space-y-5">
                    {/* Banner + thông tin cơ bản */}
                    <div className="bg-card border rounded-2xl overflow-hidden">
                        <div className="aspect-[16/6] bg-muted">
                            {farmImages[0] ? (
                                <img src={farmImages[0]} alt={farm.farmName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full grid place-items-center text-sm text-muted-foreground">Chưa có ảnh</div>
                            )}
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-bold">{farm.farmName}</h1>
                                <StatusBadge status={badge} />
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="w-4 h-4" /> {farm.address ?? "Chưa cập nhật địa chỉ"}
                            </div>
                            <p className="text-sm mt-2 text-muted-foreground">{farm.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                <Info label="Chủ trang trại" value={farm.ownerName ?? "—"} />
                                <Info label="Diện tích" value={farm.areaHa ? `${farm.areaHa} ha` : "—"} />
                                <Info label="Phương pháp" value={farm.farmingMethod ?? "—"} />
                                <Info label="Ngày đăng ký" value={farm.createdAt ? formatDate(farm.createdAt) : "—"} />
                            </div>
                        </div>
                    </div>

                    {/* Ảnh nông trại */}
                    {farmImages.length > 1 && (
                        <div className="bg-card border rounded-2xl p-5">
                            <h3 className="font-semibold mb-3">Hình ảnh nông trại ({farmImages.length})</h3>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                {farmImages.map((url, i) => (
                                    <button key={i} type="button" onClick={() => setLightbox(url)}>
                                        <img src={url} alt={`Ảnh ${i + 1}`} className="w-full aspect-square rounded-lg object-cover hover:opacity-80 transition" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Giấy tờ, chứng nhận */}
                    <div className="bg-card border rounded-2xl p-5">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Award className="w-4 h-4 text-primary" /> Giấy tờ, chứng nhận ({certificates.length})
                        </h3>
                        {certificates.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {certificates.map((url, i) => (
                                    <button key={i} type="button" onClick={() => setLightbox(url)}
                                            className="block w-full aspect-[4/3] bg-muted relative group rounded-xl overflow-hidden border">
                                        <img src={url} alt={`Chứng nhận ${i + 1}`} className="w-full h-full object-cover" />
                                        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 grid place-items-center transition">
                      <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                    </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Chưa tải lên chứng nhận nào.</p>
                        )}
                    </div>
                </div>

                <aside className="space-y-5">
                    <div className="bg-card border rounded-2xl p-5">
                        <h3 className="font-semibold flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-primary" /> Cấp tin cậy
                        </h3>
                        <div className="text-3xl font-bold text-primary">
                            {trust.level}<span className="text-base text-muted-foreground">/3</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{trust.text}</div>
                        <div className="mt-4 text-sm">
                            <span className="text-muted-foreground">Số sản phẩm: </span><b>{farm.totalProducts}</b>
                        </div>
                    </div>

                    {status === "pending" ? (
                        <div className="bg-card border rounded-2xl p-5">
                            <h3 className="font-semibold mb-3">Quyết định duyệt hồ sơ</h3>
                            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
                                      placeholder="Lý do từ chối..."
                                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                            {errorMsg && <p className="text-xs text-destructive mt-2">{errorMsg}</p>}
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => void decide("reject")} disabled={submitting}
                                        className="flex-1 border-2 border-destructive text-destructive py-2.5 rounded-xl font-semibold hover:bg-destructive/5 disabled:opacity-50 flex items-center justify-center gap-1.5">
                                    <X className="w-4 h-4" /> Từ chối
                                </button>
                                <button onClick={() => void decide("approve")} disabled={submitting}
                                        className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5">
                                    <Check className="w-4 h-4" /> Duyệt hồ sơ
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card border rounded-2xl p-5 text-center text-sm text-muted-foreground">
                            Hồ sơ đã được xử lý: <b>{status === "approved" ? "Đã duyệt" : "Đã từ chối"}</b>
                        </div>
                    )}
                </aside>
            </div>

            {lightbox && (
                <div onClick={() => setLightbox(null)} className="fixed inset-0 bg-black/80 z-50 grid place-items-center p-6 cursor-zoom-out">
                    <img src={lightbox} alt="" className="max-w-3xl max-h-[85vh] rounded-xl object-contain" />
                </div>
            )}
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-2.5 rounded-lg bg-muted/50">
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="font-medium text-sm mt-0.5">{value}</div>
        </div>
    );
}