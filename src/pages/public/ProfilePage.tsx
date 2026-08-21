import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";
import { User, Mail, Phone, MapPin, Save, LogOut, ShoppingBag, Package, LayoutDashboard } from "lucide-react";

const ROLE_LABEL: Record<string, string> = { Admin: "Quản trị viên", Seller: "Nông dân / Người bán", Buyer: "Người mua" };

export default function ProfilePage() {
    const { user: sessionUser, logout } = useAuth();
    const navigate = useNavigate();
    const { data: profile, loading, refetch } = useFetch(() => authService.getProfile(), []);

    const [form, setForm] = useState({ full_name: "", phone: "", address: "", avatar: "" });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const handleLogout = () => {
        logout();
        navigate("/auth/login");
    };
    useEffect(() => {
        if (profile) {
            setForm({
                full_name: profile.data.full_name ?? "",
                phone: profile.data.phone ?? "",
                address: profile.data.address ?? "",
                avatar: profile.data.avatar ?? "",
            });
        }
    }, [profile]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            await authService.updateProfile(form);
            setMessage("Đã cập nhật hồ sơ.");
            refetch();
        } catch (err: any) {
            setMessage(err?.message ?? "Cập nhật thất bại");
        } finally {
            setSaving(false);
        }
    };

    const role = profile?.data.role ?? sessionUser?.role;
    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {

        const file = e.target.files?.[0];

        if (!file) return;

        try {
            setSaving(true);
            setMessage("");

            const result =
                await authService.uploadAvatar(file);

            setForm((prev) => ({
                ...prev,
                avatar: result.data.avatar ?? "",
            }));

            setMessage(
                "Đã cập nhật ảnh đại diện.",
            );

        } catch (err: any) {

            setMessage(
                err?.response?.data?.message ??
                err?.message ??
                "Upload ảnh thất bại",
            );

        } finally {
            setSaving(false);
        }
    };
    if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-muted-foreground">Đang tải...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>

            <div className="mt-6 grid md:grid-cols-[1fr_260px] gap-5 items-start">
                {/* Form chỉnh sửa */}
                <form onSubmit={submit} className="bg-card border rounded-2xl p-6 space-y-4">
                    {message && <p className="text-sm text-primary">{message}</p>}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary grid place-items-center text-xl font-semibold overflow-hidden flex-shrink-0">
                            {form.avatar ? <img src={form.avatar} alt="" className="w-full h-full object-cover" /> : (form.full_name[0] ?? "U")}
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium">Ảnh đại diện (URL)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm"
                            />
                        </div>
                    </div>

                    <Field icon={User} label="Họ và tên" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
                    <div>
                        <label className="text-sm font-medium flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email</label>
                        <input value={profile?.data.email ?? ""} disabled className="w-full mt-1 px-3 py-2 rounded-lg border bg-muted/50 text-muted-foreground" />
                    </div>
                    <Field icon={Phone} label="Số điện thoại" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                    <Field icon={MapPin} label="Địa chỉ" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />

                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold disabled:opacity-50">
                        <Save className="w-4 h-4" /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </form>

                {/* Cột phải: thông tin nhanh + lối tắt */}
                <aside className="space-y-4">
                    <div className="bg-card border rounded-2xl p-5 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary grid place-items-center text-xl font-semibold mx-auto overflow-hidden">
                            {form.avatar ? <img src={form.avatar} alt="" className="w-full h-full object-cover" /> : (form.full_name[0] ?? "U")}
                        </div>
                        <div className="font-semibold mt-3">{form.full_name || "—"}</div>
                        <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {role ? ROLE_LABEL[role] : "—"}
            </span>
                        {profile?.data.created_at && (
                            <div className="text-xs text-muted-foreground mt-2">Tham gia từ {formatDate(profile.data.created_at)}</div>
                        )}
                    </div>

                    <div className="bg-card border rounded-2xl p-2">
                        {role === "buyer" && (
                            <Shortcut to="/orders" icon={ShoppingBag} label="Đơn hàng của tôi"/>
                        )}
                        {role === "seller" && (
                            <>
                                <Shortcut to="/seller" icon={LayoutDashboard} label="Kênh nông dân"/>
                                <Shortcut to="/seller/batches" icon={Package} label="Lô hàng của tôi"/>
                            </>
                        )}
                        {role === "admin" && (
                            <Shortcut to="/admin" icon={LayoutDashboard} label="Trang quản trị"/>
                        )}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/5"
                        >
                            <LogOut className="w-4 h-4"/>
                            Đăng xuất
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function Field({icon: Icon, label, value, onChange}: {
    icon: typeof User;
    label: string;
    value: string;
    onChange: (v: string) => void
}) {
    return (
        <div>
            <label className="text-sm font-medium flex items-center gap-1.5"><Icon className="w-3.5 h-3.5 text-muted-foreground" /> {label}</label>
            <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" />
        </div>
    );
}

function Shortcut({ to, icon: Icon, label }: { to: string; icon: typeof User; label: string }) {
    return (
        <Link to={to} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-muted">
            <Icon className="w-4 h-4 text-primary" /> {label}
        </Link>
    );
}