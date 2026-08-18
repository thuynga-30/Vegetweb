import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { TrustBadge } from "./TrustBadge";
import type { ProductCard as ProductCardType } from "@/types/product";

export function ProductCard({
                                product,
                            }: {
    product: ProductCardType;
}) {
    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-card rounded-2xl border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden bg-muted">
                {product.image ? (
                    <img
                        src={product.image|| "/placeholder-product.jpg"}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground">
                        Không có ảnh
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">

                {/* Trust level */}
                {product.batchTrustLevel && (
                    <TrustBadge
                        level={product.batchTrustLevel}
                        size="sm"
                    />
                )}

                {/* Product name */}
                <h3 className="font-semibold line-clamp-1">
                    {product.name}
                </h3>

                {/* Farm */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 shrink-0" />

                    <span className="line-clamp-1">
                        {product.farmName ?? "Chưa có thông tin nông trại"}
                    </span>
                </div>

                {/* Price + quantity */}
                <div className="flex items-baseline justify-between pt-1">
                    <span className="text-lg font-bold text-primary">
                        {formatCurrency(Number(product.price))}
                    </span>

                    <span className="text-[10px] text-muted-foreground">
                        Còn {product.remainingQuantity ?? 0}kg
                    </span>
                </div>
            </div>
        </Link>
    );
}