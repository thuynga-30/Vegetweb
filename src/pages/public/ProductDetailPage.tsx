import {useParams, Link} from "react-router-dom";
import {useFetch} from "@/hooks/useFetch";
import {productService} from "@/services/productService";

import {TrustBadge} from "@/components/common/TrustBadge";
import {ReviewSection} from "@/components/common/ReviewSection";

import {formatCurrency, formatDate} from "@/lib/utils";

import {
    MapPin,
    ScanLine,
    ShoppingCart,
    Calendar,
} from "lucide-react";

import {useState} from "react";
import {useCart} from "@/hooks/useCart";

export default function ProductDetailPage() {
    const {id} = useParams();

    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const [cartError, setCartError] = useState("");

    const productId = Number(id);

    const {addItem} = useCart();

    const {
        data: product,
        loading,
    } = useFetch(
        () => productService.getById(productId),
        [productId]
    );

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-muted-foreground">
                Đang tải...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-muted-foreground">
                Không tìm thấy sản phẩm.
            </div>
        );
    }

    const batch = product.currentBatch;

    const remaining = batch?.quantity ?? 0;

    const handleAddToCart = async () => {
        if (!batch) {
            setCartError(
                "Sản phẩm hiện không có lô hàng đang bán."
            );
            return;
        }

        if (remaining <= 0) {
            setCartError("Sản phẩm đã hết hàng.");
            return;
        }

        if (qty > remaining) {
            setCartError(
                `Chỉ còn ${remaining}kg trong lô hàng.`
            );
            return;
        }

        setAdding(true);
        setCartMessage("");
        setCartError("");

        try {
            await addItem(batch.id, qty);

            setCartMessage(
                `Đã thêm ${qty}kg ${product.name} vào giỏ hàng.`
            );
            setQty(1);
        } catch (error: any) {
            console.error("Add to cart error:", error);

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            const message =
                error?.response?.data?.message ??
                error?.message ??
                "Không thể thêm sản phẩm vào giỏ hàng.";

            setCartError(
                Array.isArray(message)
                    ? message.join(", ")
                    : message
            );
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">

            <div className="grid md:grid-cols-2 gap-10">

                <div className="rounded-2xl overflow-hidden border bg-muted aspect-square">

                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            Không có hình ảnh
                        </div>
                    )}

                </div>

                <div>
                    {batch?.trustLevel && (
                        <TrustBadge
                            level={batch.trustLevel}
                        />
                    )}

                    <h1 className="text-3xl font-bold mt-3">
                        {product.name}
                    </h1>

                    <div className="flex items-start gap-1 text-sm text-muted-foreground mt-2">

                        <MapPin className="w-4 h-4 mt-0.5 shrink-0"/>

                        <div>

                            {product.farm ? (
                                <>
                                    <Link
                                        to={`/farms/${product.farm.id}`}
                                        className="text-foreground font-medium hover:text-primary hover:underline"
                                    >
                                        {product.farm.farmName}
                                    </Link>

                                    {product.farm.address && (
                                        <span>
                                            {" · "}
                                            {product.farm.address}
                                        </span>
                                    )}
                                </>
                            ) : (
                                "Chưa có thông tin nông trại"
                            )}

                        </div>

                    </div>

                    <div className="text-3xl font-bold text-primary mt-4">
                        {formatCurrency(product.price)}
                    </div>

                    {batch ? (
                        <div className="text-sm text-muted-foreground mt-1">
                            Còn {remaining}kg trong lô{" "}
                            {batch.batchCode}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground mt-1">
                            Hiện không có lô hàng đang bán.
                        </div>
                    )}

                    {batch && remaining > 0 && (
                        <div className="mt-6">

                            <div className="flex items-center gap-3">

                                <div className="flex items-center border rounded-lg overflow-hidden">

                                    <button
                                        type="button"
                                        disabled={adding}
                                        onClick={() =>
                                            setQty((q) =>
                                                Math.max(
                                                    1,
                                                    q - 1
                                                )
                                            )
                                        }
                                        className="px-3 py-2 hover:bg-muted disabled:opacity-50">
                                        −
                                    </button>

                                    <span className="px-4 min-w-[50px] text-center">
                                        {qty}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={adding}
                                        onClick={() =>
                                            setQty((q) =>
                                                Math.min(
                                                    remaining,
                                                    q + 1
                                                )
                                            )
                                        }
                                        className="px-3 py-2 hover:bg-muted disabled:opacity-50">
                                        +
                                    </button>

                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={adding}
                                    className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl disabled:opacity-50">
                                    <ShoppingCart className="w-4 h-4"/>

                                    {adding
                                        ? "Đang thêm..."
                                        : "Thêm vào giỏ"}

                                </button>

                            </div>

                            {cartMessage && (
                                <p className="text-sm text-green-600 mt-3">
                                    {cartMessage}
                                </p>
                            )}
                            {cartError && (
                                <p className="text-sm text-destructive mt-3">
                                    {cartError}
                                </p>
                            )}

                        </div>
                    )}
                    {batch && remaining <= 0 && (
                        <div className="mt-6">

                            <button
                                disabled
                                className="w-full py-3 rounded-xl bg-muted text-muted-foreground font-semibold"
                            >
                                Hết hàng
                            </button>

                        </div>
                    )}
                    {batch && (
                        <Link
                            to={`/trace?code=${batch.batchCode}`}
                            className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <ScanLine className="w-4 h-4"/>

                            Xem nguồn gốc lô hàng{" "}
                            {batch.batchCode}
                        </Link>
                    )}
                    {batch && (
                        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">

                            <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-2">

                                <Calendar className="w-4 h-4 text-muted-foreground"/>

                                <span>
                                    Gieo trồng:{" "}
                                    <b>
                                        {formatDate(
                                            batch.plantingDate
                                        )}
                                    </b>
                                </span>

                            </div>

                            <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-2">

                                <Calendar className="w-4 h-4 text-muted-foreground"/>

                                <span>
                                    Thu hoạch:{" "}
                                    <b>
                                        {formatDate(
                                            batch.harvestDate
                                        )}
                                    </b>
                                </span>

                            </div>

                        </div>
                    )}

                </div>

            </div>
            <ReviewSection productId={product.id}/>

        </div>
    );
}