import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { orderService } from "@/services/orderService";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Wallet, Truck } from "lucide-react";
import {paymentService} from "@/services/paymentService.ts";

const SHIPPING = 25000;

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [pay, setPay] = useState("COD");
    const [form, setForm] = useState({
        receiver_name: user?.full_name ?? "",
        receiver_phone: user?.phone ?? "",
        shipping_address: user?.address ?? "",
        note: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            setError("Giỏ hàng đang trống.");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const payload = {
                cartItemIds: items.map((item) => item.cart_id),
                receiverName: form.receiver_name,
                receiverPhone: form.receiver_phone,
                shippingAddress: form.shipping_address,
                paymentMethod: pay as "COD" | "VNPay",
            };

            const response = await orderService.checkout(payload);
            console.log("Checkout success:", response);

            clearCart();

            if (pay === "VNPay") {
                const { paymentUrl } = await paymentService.createVnpayUrl(response.orderId);
                window.location.href = paymentUrl; // chuyển hẳn sang trang VNPay
                return;
            }

            setSuccess(`Đặt hàng thành công! Mã đơn hàng: #${response.orderId}`);
            setTimeout(() => navigate("/orders"), 800);
        } catch (err: any) {
            console.error("Checkout error:", err);
            const message = err?.response?.data?.message ?? err?.message ?? "Đặt hàng thất bại, vui lòng thử lại.";
            setError(Array.isArray(message) ? message.join(", ") : message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold">Thanh toán</h1>

            <form onSubmit={submit} className="mt-6 grid md:grid-cols-[1fr_380px] gap-6">
                <div className="space-y-5">

                    <div className="bg-card border rounded-2xl p-6">
                        <h2 className="font-semibold mb-4">Thông tin nhận hàng</h2>

                        {error && <p className="text-sm text-destructive mb-3">{error}</p>}

                        {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

                        <div className="grid md:grid-cols-2 gap-3">
                            <Field
                                label="Họ tên"
                                value={form.receiver_name}
                                onChange={(v) => setForm({ ...form, receiver_name: v })}
                            />

                            <Field
                                label="Số điện thoại"
                                value={form.receiver_phone}
                                onChange={(v) => setForm({ ...form, receiver_phone: v })}
                            />

                            <Field
                                label="Địa chỉ"
                                value={form.shipping_address}
                                onChange={(v) => setForm({ ...form, shipping_address: v })}
                                className="md:col-span-2"
                            />

                            <div className="md:col-span-2">
                                <label className="text-sm font-medium">Ghi chú</label>

                                <textarea
                                    rows={2}
                                    value={form.note}
                                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded-lg border bg-background"
                                    placeholder="Ghi chú cho người bán / shipper..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-2xl p-6">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-primary" />
                            Phương thức giao hàng
                        </h2>

                        <div className="p-4 rounded-xl border-2 border-primary/40 bg-primary/5 text-sm">
                            <b>Giao qua điểm gom khu vực</b> — Đơn được gom tại hub khu vực gần bạn, kiểm tra chất
                            lượng lần 2 trước khi bàn giao đối tác vận chuyển. Dự kiến 24-48h.
                        </div>
                    </div>

                    <div className="bg-card border rounded-2xl p-6">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-primary" />
                            Phương thức thanh toán
                        </h2>

                        <div className="space-y-2">
                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${pay === "COD" ? "border-primary bg-primary/5" : ""}`}>
                                <input type="radio" name="pay" value="COD" checked={pay === "COD"} onChange={() => setPay("COD")} className="accent-primary" />
                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                                Thanh toán khi nhận hàng (COD)
                            </label>

                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${pay === "VNPay" ? "border-primary bg-primary/5" : ""}`}>
                                <input type="radio" name="pay" value="VNPay" checked={pay === "VNPay"} onChange={() => setPay("VNPay")} className="accent-primary" />
                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                                VNPay (ATM / Thẻ quốc tế / QR)
                            </label>

                            {[
                                { v: "banking", l: "Chuyển khoản ngân hàng" },
                                { v: "momo", l: "Ví MoMo" },
                            ].map((o) => (
                                <label key={o.v} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer opacity-50">
                                    <input type="radio" disabled className="accent-primary" />
                                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                                    {o.l}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="bg-card border rounded-2xl p-5 h-fit sticky top-20">

                    <div className="font-semibold mb-3">Đơn của bạn ({items.length} sản phẩm)</div>

                    <div className="space-y-2 max-h-64 overflow-auto">

                        {items.map((i) => (
                            <div key={i.cart_id} className="flex gap-3 text-sm">
                                {i.image ? (
                                    <img src={i.image} className="w-12 h-12 rounded-lg object-cover" alt=""/>
                                ) : (
                                    <div
                                        className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                        No image
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="line-clamp-1">{i.product_name}</div>

                                    <div className="text-xs text-muted-foreground">
                                        SL: {i.quantity} · {formatCurrency(i.price)}
                                    </div>
                                </div>

                                <div className="font-semibold">{formatCurrency(i.price * i.quantity)}</div>
                            </div>
                        ))}

                        {items.length === 0 && (
                            <Link to="/products" className="text-sm text-primary">
                                Giỏ hàng trống — mua sắm
                            </Link>
                        )}
                    </div>

                    <div className="border-t mt-4 pt-4 space-y-2 text-sm">

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tạm tính</span>

                            <span>{formatCurrency(totalPrice)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Vận chuyển</span>

                            <span>{formatCurrency(SHIPPING)}</span>
                        </div>

                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Tổng cộng</span>

                            <span className="text-primary">{formatCurrency(totalPrice + SHIPPING)}</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={items.length === 0 || loading}
                        className="mt-5 w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold disabled:opacity-50">
                        {loading ? "Đang xử lý..." : pay === "VNPay" ? "Thanh toán qua VNPay" : "Đặt hàng"}
                    </button>
                </aside>
            </form>
        </div>
    );
}

function Field({label, value, onChange, className = "",}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    className?: string;
}) {
    return (
        <div className={className}>
            <label className="text-sm font-medium">{label}</label>

            <input value={value} onChange={(e) => onChange(e.target.value)} required className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" />
        </div>
    );
}