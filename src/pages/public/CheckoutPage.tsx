import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cartService} from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Wallet, Truck } from "lucide-react";
import type {CartItemResponse} from "@/types/cart.ts";

const SHIPPING = 25000;

export default function CheckoutPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [items, setItems] = useState<CartItemResponse[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [pay, setPay] = useState<"COD" | "ZaloPay" | "Momo">("COD");

    const [form, setForm] = useState({
        receiverName: user?.full_name ?? "",
        receiverPhone: user?.phone ?? "",
        shippingAddress: user?.address ?? "",
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        const loadCart = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await cartService.getMyCart();

                setItems(res.items);
                setTotalPrice(Number(res.totalAmount));
            } catch (err: any) {
                console.error("Load checkout cart error:", err);

                setError(
                    err?.response?.data?.message ??
                    err?.message ??
                    "Không thể tải giỏ hàng"
                );
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, []);

    // =========================
    // CẬP NHẬT THÔNG TIN USER
    // =========================
    useEffect(() => {
        setForm({
            receiverName: user?.full_name ?? "",
            receiverPhone: user?.phone ?? "",
            shippingAddress: user?.address ?? "",
        });
    }, [user]);

    // =========================
    // ĐẶT HÀNG
    // =========================
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            setError("Giỏ hàng đang trống");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            const payload = {
                cartItemIds: items.map((item) => item.id),

                receiverName: form.receiverName,
                receiverPhone: form.receiverPhone,
                shippingAddress: form.shippingAddress,

                paymentMethod: pay,
            };

            console.log("CHECKOUT PAYLOAD:", payload);

            const response = await orderService.checkout(payload);

            console.log("CHECKOUT RESPONSE:", response);

            navigate("/orders");
        } catch (err: any) {
            console.error("Checkout error:", err);

            const message =
                err?.response?.data?.message ??
                err?.message ??
                "Đặt hàng thất bại, vui lòng thử lại";

            setError(
                Array.isArray(message)
                    ? message.join(", ")
                    : message
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-center text-muted-foreground">
                Đang tải thông tin thanh toán...
            </div>
        );
    }

    // =========================
    // CART EMPTY
    // =========================
    if (items.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold">
                    Thanh toán
                </h1>

                <p className="mt-4 text-muted-foreground">
                    Giỏ hàng của bạn đang trống.
                </p>

                <Link
                    to="/products"
                    className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold"
                >
                    Đi mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">

            <h1 className="text-3xl font-bold">
                Thanh toán
            </h1>

            <form
                onSubmit={submit}
                className="mt-6 grid md:grid-cols-[1fr_380px] gap-6"
            >

                {/* =========================
                    LEFT
                ========================= */}
                <div className="space-y-5">

                    {/* THÔNG TIN NHẬN HÀNG */}
                    <div className="bg-card border rounded-2xl p-6">

                        <h2 className="font-semibold mb-4">
                            Thông tin nhận hàng
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-3">

                            <Field
                                label="Họ tên"
                                value={form.receiverName}
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        receiverName: v,
                                    })
                                }
                            />

                            <Field
                                label="Số điện thoại"
                                value={form.receiverPhone}
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        receiverPhone: v,
                                    })
                                }
                            />

                            <Field
                                label="Địa chỉ giao hàng"
                                value={form.shippingAddress}
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        shippingAddress: v,
                                    })
                                }
                                className="md:col-span-2"
                            />

                        </div>
                    </div>

                    {/* PHƯƠNG THỨC GIAO HÀNG */}
                    <div className="bg-card border rounded-2xl p-6">

                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-primary" />
                            Phương thức giao hàng
                        </h2>

                        <div className="p-4 rounded-xl border-2 border-primary/40 bg-primary/5 text-sm">

                            <b>Giao qua điểm gom khu vực</b>

                            <p className="mt-1 text-muted-foreground">
                                Đơn được gom tại hub khu vực gần bạn,
                                kiểm tra chất lượng lần 2 trước khi bàn
                                giao đối tác vận chuyển.
                            </p>

                            <p className="mt-1 text-muted-foreground">
                                Dự kiến giao hàng: 24–48h.
                            </p>

                        </div>
                    </div>

                    {/* THANH TOÁN */}
                    <div className="bg-card border rounded-2xl p-6">

                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-primary" />
                            Phương thức thanh toán
                        </h2>

                        <div className="space-y-2">

                            <label
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                                    pay === "COD"
                                        ? "border-primary bg-primary/5"
                                        : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value="COD"
                                    checked={pay === "COD"}
                                    onChange={() => setPay("COD")}
                                />

                                <CreditCard className="w-4 h-4 text-muted-foreground" />

                                <div>
                                    <div className="font-medium">
                                        Thanh toán khi nhận hàng
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        COD
                                    </div>
                                </div>
                            </label>

                        </div>

                    </div>

                </div>

                {/* =========================
                    RIGHT - ORDER SUMMARY
                ========================= */}
                <aside className="bg-card border rounded-2xl p-5 h-fit sticky top-20">

                    <div className="font-semibold mb-3">
                        Đơn của bạn ({items.length} sản phẩm)
                    </div>

                    <div className="space-y-3 max-h-72 overflow-auto">

                        {items.map((item) => (

                            <div
                                key={item.id}
                                className="flex gap-3 text-sm"
                            >

                                <div className="flex-1">

                                    <div className="font-medium">
                                        {item.product?.name}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        Lô {item.batch.batchCode}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        Số lượng: {item.quantity}
                                    </div>

                                </div>

                                <div className="font-semibold">
                                    {formatCurrency(
                                        item.subtotal
                                    )}
                                </div>

                            </div>

                        ))}

                    </div>

                    {/* TOTAL */}
                    <div className="border-t mt-4 pt-4 space-y-2 text-sm">

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Tạm tính
                            </span>

                            <span>
                                {formatCurrency(totalPrice)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Vận chuyển
                            </span>

                            <span>
                                {formatCurrency(SHIPPING)}
                            </span>
                        </div>

                        <div className="flex justify-between font-bold text-lg pt-2 border-t">

                            <span>
                                Tổng cộng
                            </span>

                            <span className="text-primary">
                                {formatCurrency(
                                    totalPrice + SHIPPING
                                )}
                            </span>

                        </div>

                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-5 w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold disabled:opacity-50"
                    >
                        {submitting
                            ? "Đang đặt hàng..."
                            : "Đặt hàng"}
                    </button>

                </aside>

            </form>
        </div>
    );
}

function Field({
                   label,
                   value,
                   onChange,
                   className = "",
               }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    className?: string;
}) {
    return (
        <div className={className}>

            <label className="text-sm font-medium">
                {label}
            </label>

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-background"
            />

        </div>
    );
}