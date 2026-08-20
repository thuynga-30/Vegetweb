import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { Leaf } from "lucide-react";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState<"buyer" | "seller">("buyer");
    const [form, setForm] = useState({ full_name: "", email: "", password: "", phone: "", address: "" });
    const [agree, setAgree] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!agree) {
            setError("Vui lòng đồng ý với điều khoản và chính sách bảo mật.");
            return;
        }
        setLoading(true);
        try {
            await authService.register({ ...form, role });
            navigate("/auth/login");
        } catch (err: any) {
            setError(err?.message ?? "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-background">
            {/* Panel trái */}
            <div className="hidden md:flex flex-col items-center justify-center bg-hero-gradient text-white p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_45%)]" />
                <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur grid place-items-center mx-auto border border-white/25">
                        <Leaf className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold mt-6">Tham gia GreenFarmer</h2>
                    <p className="text-white/85 mt-3 max-w-xs mx-auto">
                        Mua nông sản sạch hoặc bán sản phẩm của trang trại bạn.
                    </p>
                </div>
            </div>

            {/* Panel phải: form */}
            <div className="flex flex-col justify-center px-6 md:px-16 py-12">
                <div className="w-full max-w-sm mx-auto">
                    <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                        <div className="w-9 h-9 rounded-xl bg-hero-gradient grid place-items-center text-white">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <span>Green<span className="text-primary">Farmer</span></span>
                    </Link>

                    <h1 className="text-2xl font-bold mt-8">Đăng ký tài khoản</h1>

                    <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-muted mt-5">
                        {(["buyer", "seller"] as const).map((r) => (
                            <button
                                type="button" key={r} onClick={() => setRole(r)}
                                className={`py-2 rounded-md text-sm font-medium transition ${role === r ? "bg-card shadow border" : "text-muted-foreground"}`}
                            >
                                {r === "buyer" ? "Người mua" : "Nông dân / Người bán"}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <div>
                            <label className="text-sm font-medium">Họ và tên</label>
                            <input required value={form.full_name}
                                   onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                   className="w-full mt-1 px-3 py-2.5 rounded-lg border bg-background" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Số điện thoại</label>
                                <input required value={form.phone}
                                       onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                       className="w-full mt-1 px-3 py-2.5 rounded-lg border bg-background" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <input type="email" required value={form.email}
                                       onChange={(e) => setForm({ ...form, email: e.target.value })}
                                       className="w-full mt-1 px-3 py-2.5 rounded-lg border bg-background" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Mật khẩu</label>
                            <input type="password" required value={form.password}
                                   onChange={(e) => setForm({ ...form, password: e.target.value })}
                                   className="w-full mt-1 px-3 py-2.5 rounded-lg border bg-background" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Địa chỉ</label>
                            <input required value={form.address}
                                   onChange={(e) => setForm({ ...form, address: e.target.value })}
                                   className="w-full mt-1 px-3 py-2.5 rounded-lg border bg-background" />
                        </div>
                        <label className="flex items-start gap-2 text-sm text-muted-foreground">
                            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="accent-primary mt-0.5" />
                            Tôi đồng ý với điều khoản và chính sách bảo mật của GreenFarmer
                        </label>
                        <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold disabled:opacity-50">
                            {loading ? "Đang tạo..." : "Tạo tài khoản"}
                        </button>
                    </form>

                    <p className="text-sm text-center text-muted-foreground mt-6">
                        Đã có tài khoản? <Link to="/auth/login" className="text-primary font-medium hover:underline">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}