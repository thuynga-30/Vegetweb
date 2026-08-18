import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { farmService } from "@/services/farmService";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { MapPin, Award, ShieldCheck, FileText, TrendingUp, Check, X, ZoomIn } from "lucide-react";

export default function FarmApprovalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: farm, loading } = useFetch(() => farmService.getById(Number(id)), [id]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>;
  if (!farm) return <p className="text-muted-foreground">Không tìm thấy nông trại.</p>;

  const approve = async () => {
    setSubmitting(true);
    try {
      await farmService.approve(farm.id, note);
      navigate("/admin/users");
    } finally {
      setSubmitting(false);
    }
  };

  const reject = async () => {
    setSubmitting(true);
    try {
      await farmService.reject(farm.id, note || "Hồ sơ chưa đủ minh chứng");
      navigate("/admin/users");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link to="/admin/users" className="text-sm text-muted-foreground hover:text-primary">← Danh sách người dùng</Link>

      <div className="mt-3 grid md:grid-cols-3 gap-5">
        {/* Cột trái + giữa: toàn bộ thông tin */}
        <div className="md:col-span-2 space-y-5">
          {/* Banner + thông tin cơ bản */}
          <div className="bg-card border rounded-2xl overflow-hidden">
            <div className="aspect-[16/6] bg-muted">
              <img src={farm.image} alt={farm.farm_name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{farm.farm_name}</h1>
                <StatusBadge status={farm.approval_status ?? "Pending"} />
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" /> {farm.address}
              </div>
              <p className="text-sm mt-2 text-muted-foreground">{farm.description}</p>
              <div className="grid grid-cols-4 gap-3 mt-4">
                <Info label="Chủ trang trại" value={farm.owner_name ?? "—"} />
                <Info label="Diện tích" value={farm.area_ha ? `${farm.area_ha} ha` : "—"} />
                <Info label="Phương pháp" value={farm.farming_method ?? "—"} />
                <Info label="Ngày đăng ký" value={formatDate(farm.created_at)} />
              </div>
            </div>
          </div>


          {/* Giấy phép kinh doanh (nếu có) */}
          {farm.business_license && (
            <div className="bg-card border rounded-2xl p-5">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><FileText className="w-4 h-4 text-primary" /> Giấy phép hộ kinh doanh</h3>
              <DocThumb label="Giấy phép kinh doanh" src={farm.business_license} onZoom={setLightbox} wide />
            </div>
          )}

          {/* Chứng nhận canh tác */}
          <div className="bg-card border rounded-2xl p-5">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><Award className="w-4 h-4 text-primary" /> Chứng nhận canh tác</h3>
            {farm.certifications && farm.certifications.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {farm.certifications.map((c) => (
                  <div key={c.name} className="border rounded-xl overflow-hidden">
                    {c.image && (
                      <button type="button" onClick={() => setLightbox(c.image!)} className="block w-full aspect-[4/3] bg-muted relative group">
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 grid place-items-center transition">
                          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                        </span>
                      </button>
                    )}
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{c.name}</span>
                        {c.verified ? (
                          <span className="flex items-center gap-1 text-xs text-primary"><ShieldCheck className="w-3.5 h-3.5" /> Đã xác minh</span>
                        ) : (
                          <span className="text-xs text-amber-600">Chờ xác minh</span>
                        )}
                      </div>
                      {c.issued_date && <div className="text-xs text-muted-foreground mt-0.5">Cấp ngày {formatDate(c.issued_date)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có chứng nhận nào.</p>
            )}
          </div>
        </div>

        {/* Cột phải: điểm uy tín + hành động duyệt */}
        <aside className="space-y-5">
          <div className="bg-card border rounded-2xl p-5">
            <h3 className="font-semibold flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-primary" /> Điểm uy tín</h3>
            <div className="text-3xl font-bold text-primary">{farm.trust_score ?? "—"}<span className="text-base text-muted-foreground">/5</span></div>
            <div className="mt-4 space-y-3">
              {(farm.trust_metrics ?? []).map((m) => (
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

          <div className="bg-card border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Quyết định duyệt hồ sơ</h3>
            {farm.approval_note && (
              <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5 mb-3">Ghi chú trước đó: {farm.approval_note}</div>
            )}
            <textarea
              rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú duyệt / lý do từ chối..."
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={reject} disabled={submitting} className="flex-1 border-2 border-destructive text-destructive py-2.5 rounded-xl font-semibold hover:bg-destructive/5 disabled:opacity-50 flex items-center justify-center gap-1.5">
                <X className="w-4 h-4" /> Từ chối
              </button>
              <button onClick={approve} disabled={submitting} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Duyệt hồ sơ
              </button>
            </div>
          </div>
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

function DocThumb({ label, src, onZoom, wide }: { label: string; src?: string; onZoom: (src: string) => void; wide?: boolean }) {
  if (!src) {
    return (
      <div className={`${wide ? "col-span-2" : ""} aspect-[4/3] rounded-xl border-2 border-dashed grid place-items-center text-xs text-muted-foreground`}>
        Chưa tải lên
      </div>
    );
  }
  return (
    <button type="button" onClick={() => onZoom(src)} className={`${wide ? "col-span-2" : ""} block group relative`}>
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
        <img src={src} alt={label} className="w-full h-full object-cover" />
        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 grid place-items-center transition">
          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-1 text-left">{label}</div>
    </button>
  );
}