import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { Leaf } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await authService.login(form.email, form.password);
            login(res.user, res.token);
            if (res.user.role === "seller") navigate("/seller");
            else if (res.user.role === "admin") navigate("/admin");
            else navigate("/");
        } catch (err: any) {
            setError(err?.message ?? "Đăng nhập thất bại");
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
                    <h2 className="text-3xl font-bold mt-6">Chào mừng trở lại</h2>
                    <p className="text-white/85 mt-3 max-w-xs mx-auto">
                        Nông sản sạch, truy xuất tận gốc — chỉ vài chạm là đến bàn ăn.
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

                    <h1 className="text-2xl font-bold mt-8">Đăng nhập</h1>
                    <p className="text-sm text-muted-foreground mt-1">Nhập email và mật khẩu để tiếp tục</p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email" required value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full mt-1 px-3 py-2.5 rounded-lg border bg-background"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Mật khẩu</label>
                            <input
                                type="password" required value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full mt-1 px-3 py-2.5 rounded-lg border bg-background"
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-muted-foreground">
                                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-primary" />
                                Ghi nhớ
                            </label>
                            <button type="button" className="text-primary hover:underline">Quên mật khẩu?</button>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold disabled:opacity-50">
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground">hoặc tiếp tục với</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" className="border rounded-lg py-2.5 text-sm font-medium hover:bg-muted">Google</button>
                        <button type="button" className="border rounded-lg py-2.5 text-sm font-medium hover:bg-muted">Facebook</button>
                    </div>

                    <p className="text-sm text-center text-muted-foreground mt-6">
                        Chưa có tài khoản? <Link to="/auth/register" className="text-primary font-medium hover:underline">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}