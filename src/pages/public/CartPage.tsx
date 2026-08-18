import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Trash2 } from "lucide-react";

const SHIPPING = 25000;

export default function CartPage() {
    const {
        items,
        updateQuantity,
        removeItem,
        totalPrice,
        loading,
    } = useCart();

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold">
                    Giỏ hàng
                </h1>

                <div className="mt-10 text-center text-muted-foreground">
                    Đang tải giỏ hàng...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">

            <h1 className="text-3xl font-bold">
                Giỏ hàng
            </h1>

            {items.length === 0 ? (
                <div className="mt-16 text-center">

                    <ShoppingBag
                        className="w-16 h-16 mx-auto text-muted-foreground"
                    />

                    <p className="mt-4 text-muted-foreground">
                        Giỏ hàng trống. Chọn nông sản yêu thích để bắt đầu!
                    </p>

                    <Link
                        to="/products"
                        className="mt-5 inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold"
                    >
                        Đi mua sắm
                    </Link>

                </div>
            ) : (

                <div className="mt-6 grid md:grid-cols-[1fr_360px] gap-6">

                    {/* ================= CART ITEMS ================= */}

                    <div className="space-y-3">

                        {items.map((i) => (

                            <div
                                key={i.cart_id}
                                className="bg-card border rounded-2xl p-4 flex gap-4"
                            >

                                {/* IMAGE */}

                                {i.image ? (
                                    <img
                                        src={i.image}
                                        alt={i.product_name}
                                        className="w-24 h-24 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                        Không có ảnh
                                    </div>
                                )}

                                {/* PRODUCT INFO */}

                                <div className="flex-1">

                                    <div className="font-semibold">
                                        {i.product_name}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        {i.farm_name}
                                        {" · "}
                                        Lô {i.batch_code}
                                    </div>

                                    <div className="text-primary font-bold mt-1">
                                        {formatCurrency(i.price)}
                                    </div>

                                    <div className="text-xs text-muted-foreground mt-1">
                                        Còn {i.stock}kg
                                    </div>

                                </div>

                                {/* ACTIONS */}

                                <div className="flex flex-col items-end gap-2">

                                    {/* REMOVE */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeItem(i.cart_id)
                                        }
                                        className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {/* QUANTITY */}

                                    <div className="flex items-center border rounded-lg overflow-hidden">

                                        <button
                                            type="button"
                                            disabled={i.quantity <= 1}
                                            onClick={() =>
                                                updateQuantity(
                                                    i.cart_id,
                                                    Math.max(
                                                        1,
                                                        i.quantity - 1
                                                    )
                                                )
                                            }
                                            className="px-2 hover:bg-muted disabled:opacity-50"
                                        >
                                            −
                                        </button>

                                        <span className="px-3 text-sm">
                                            {i.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            disabled={
                                                i.quantity >= i.stock
                                            }
                                            onClick={() =>
                                                updateQuantity(
                                                    i.cart_id,
                                                    Math.min(
                                                        i.stock,
                                                        i.quantity + 1
                                                    )
                                                )
                                            }
                                            className="px-2 hover:bg-muted disabled:opacity-50"
                                        >
                                            +
                                        </button>

                                    </div>

                                    {/* SUBTOTAL */}

                                    <div className="font-semibold">
                                        {formatCurrency(
                                            i.price * i.quantity
                                        )}
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* ================= SUMMARY ================= */}

                    <aside className="bg-card border rounded-2xl p-5 h-fit sticky top-20">

                        <div className="font-semibold">
                            Tổng đơn hàng
                        </div>

                        <div className="mt-4 space-y-2 text-sm">

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
                                    Phí vận chuyển (dự kiến)
                                </span>

                                <span>
                                    {formatCurrency(SHIPPING)}
                                </span>
                            </div>

                            <div className="border-t pt-2 flex justify-between font-bold text-lg">

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

                        <Link
                            to="/checkout"
                            className="mt-5 block text-center bg-primary text-primary-foreground py-3 rounded-xl font-semibold"
                        >
                            Tiến hành đặt hàng
                        </Link>

                        <Link
                            to="/products"
                            className="mt-2 block text-center text-sm text-muted-foreground hover:text-primary"
                        >
                            Tiếp tục mua sắm
                        </Link>

                    </aside>

                </div>
            )}

        </div>
    );
}