import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";

import { productService } from "@/services/productService";
import { farmService } from "@/services/farmService";
import { categoryService } from "@/services/categoryService";

import { ProductCard } from "@/components/common/ProductCard";

import { categoryEmoji, categoryColor } from "@/lib/utils";
import {ScanLine,Shield,Truck,Sprout, ArrowRight,Star,MapPin,} from "lucide-react";

export default function HomePage() {
    const {
        data: productResponse,
        loading: productsLoading,
        error: productsError,
    } = useFetch(
        () =>
            productService.getAll({
                page: 1,
                limit: 8,
                sort: "newest",
            }),
        []
    );
    const {
        data: farms,
        loading: farmsLoading,
        error: farmsError,
    } = useFetch(
        () => farmService.getAll(),
        []
    );
    const {
        data: categories,
        loading: categoriesLoading,
        error: categoriesError,
    } = useFetch(
        () => categoryService.getAll(),
        []
    );

    const products = productResponse?.data ?? [];

    const totalProducts =
        productResponse?.meta?.total ?? products.length;

    const highlight = products[0];
    return (
        <>
            <section className="relative overflow-hidden">

                <div className="absolute inset-0 bg-hero-gradient opacity-95" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.15),transparent_40%)]" />

                <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center text-white">

                    <div>

                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs backdrop-blur border border-white/20">
                            <Sprout className="w-3.5 h-3.5" />

                            Từ nông trại đến bàn ăn
                        </span>

                        <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
                            Nông sản sạch,
                            <br />
                            truy xuất tận gốc
                        </h1>

                        <p className="mt-4 text-white/90 text-lg max-w-lg">
                            Mỗi lô hàng đều có nhật ký canh tác chi tiết
                            và mã QR minh bạch — bạn biết chính xác rau
                            quả đến từ đâu, được trồng thế nào.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">

                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/95 transition shadow-lg"
                            >
                                Mua sắm ngay

                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                to="/trace"
                                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 backdrop-blur px-6 py-3 rounded-xl hover:bg-white/20 transition"
                            >
                                <ScanLine className="w-4 h-4" />

                                Truy xuất QR
                            </Link>

                        </div>
                        <div className="mt-10 flex flex-wrap gap-6 text-sm">

                            <div>
                                <div className="text-2xl font-bold">
                                    {farms?.length ?? "…"}
                                </div>

                                <div className="opacity-80">
                                    Nông trại
                                </div>
                            </div>

                            <div>
                                <div className="text-2xl font-bold">
                                    {totalProducts}
                                </div>

                                <div className="opacity-80">
                                    Sản phẩm
                                </div>
                            </div>

                            {/* CUSTOMERS */}

                            <div>
                                <div className="text-2xl font-bold">
                                    8,000+
                                </div>

                                <div className="opacity-80">
                                    Khách hàng
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="relative">

                        <img
                            src={
                                highlight?.image ??
                                "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
                            }
                            alt={
                                highlight?.name ??
                                "Rau củ tươi"
                            }
                            className="rounded-3xl shadow-2xl w-full aspect-[4/5] object-cover"
                        />

                        {highlight && (

                            <div className="absolute -bottom-6 -left-6 bg-white text-foreground rounded-2xl p-4 shadow-xl w-56">

                                <div className="flex items-center gap-2 text-xs text-muted-foreground">

                                    <Shield className="w-3.5 h-3.5 text-primary" />

                                    Xác minh nguồn gốc

                                </div>

                                <div className="mt-1 font-semibold line-clamp-1">
                                    {highlight.name}
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    {highlight.farmName ??
                                        "Nông trại đối tác"}
                                </div>

                                <div className="mt-2 flex items-center gap-0.5 text-accent">

                                    {Array.from({ length: 5 }).map(
                                        (_, i) => (
                                            <Star
                                                key={i}
                                                className="w-3 h-3 fill-current"
                                            />
                                        )
                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </section>

            <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">

                {[
                    {
                        icon: Sprout,
                        title: "Nhật ký canh tác chi tiết",
                        d: "Mỗi lô hàng đều có timeline gieo trồng, chăm sóc, thu hoạch minh bạch.",
                    },
                    {
                        icon: ScanLine,
                        title: "Mã QR theo lô hàng",
                        d: "Quét QR trên bao bì để xác thực đúng nguồn gốc trước và sau khi nhận hàng.",
                    },
                    {
                        icon: Truck,
                        title: "Điểm gom khu vực",
                        d: "Logistics 2 lớp: điểm gom kiểm tra chất lượng lần 2 trước khi giao đi.",
                    },
                ].map((v) => (

                    <div
                        key={v.title}
                        className="p-6 rounded-2xl bg-card border"
                    >

                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4">

                            <v.icon className="w-6 h-6" />

                        </div>

                        <h3 className="font-semibold text-lg">
                            {v.title}
                        </h3>

                        <p className="text-muted-foreground text-sm mt-2">
                            {v.d}
                        </p>

                    </div>

                ))}

            </section>

            <section className="max-w-7xl mx-auto px-4 py-8">

                <div className="flex items-end justify-between mb-6">

                    <div>

                        <h2 className="text-2xl md:text-3xl font-bold">
                            Danh mục nông sản
                        </h2>

                        <p className="text-muted-foreground">
                            Chọn loại nông sản bạn cần
                        </p>

                    </div>

                </div>

                {categoriesLoading ? (

                    <p className="text-muted-foreground">
                        Đang tải danh mục...
                    </p>

                ) : categoriesError ? (

                    <p className="text-red-500">
                        Không thể tải danh mục.
                    </p>

                ) : categories && categories.length > 0 ? (

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                        {categories.map((c) => (

                            <Link
                                key={c.id}
                                to={`/products?category=${c.id}`}
                                className="bg-card border rounded-2xl p-6 hover:border-primary hover:shadow transition text-center flex flex-col items-center gap-3"
                            >

                                <div
                                    className={`w-14 h-14 rounded-full grid place-items-center text-2xl ${categoryColor(
                                        c.name
                                    )}`}
                                >
                                    {categoryEmoji(c.name)}
                                </div>

                                <div className="font-medium">
                                    {c.name}
                                </div>

                            </Link>

                        ))}

                    </div>

                ) : (

                    <p className="text-muted-foreground">
                        Chưa có danh mục.
                    </p>

                )}

            </section>

            <section className="max-w-7xl mx-auto px-4 py-12">

                <div className="flex items-end justify-between mb-6">

                    <div>

                        <h2 className="text-2xl md:text-3xl font-bold">
                            Sản phẩm nổi bật
                        </h2>

                        <p className="text-muted-foreground">
                            Được xác minh nguồn gốc toàn diện
                        </p>

                    </div>

                    <Link
                        to="/products"
                        className="text-sm text-primary hover:underline"
                    >
                        Xem tất cả →
                    </Link>

                </div>

                {productsLoading ? (

                    <p className="text-muted-foreground">
                        Đang tải sản phẩm...
                    </p>

                ) : productsError ? (

                    <div className="text-red-500">
                        Không thể tải danh sách sản phẩm.
                    </div>

                ) : products.length > 0 ? (

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                        {products.map((product) => (

                            <ProductCard
                                key={product.id}
                                product={product}
                            />

                        ))}

                    </div>

                ) : (

                    <p className="text-muted-foreground">
                        Chưa có sản phẩm.
                    </p>

                )}

            </section>
            <section className="max-w-7xl mx-auto px-4 py-12">

                <div className="flex items-end justify-between mb-6">

                    <div>

                        <h2 className="text-2xl md:text-3xl font-bold">
                            Nông trại đối tác
                        </h2>

                        <p className="text-muted-foreground">
                            Những nông trại đã được xác minh
                        </p>

                    </div>

                </div>

                {farmsLoading ? (

                    <p className="text-muted-foreground">
                        Đang tải nông trại...
                    </p>

                ) : farmsError ? (

                    <p className="text-red-500">
                        Không thể tải danh sách nông trại.
                    </p>

                ) : farms && farms.length > 0 ? (

                    <div className="grid md:grid-cols-3 gap-5">

                        {farms.map((farm) => (

                            <div
                                key={farm.id}
                                className="rounded-2xl overflow-hidden border bg-card"
                            >

                                {/* FARM IMAGE */}

                                <div className="aspect-[16/10] bg-muted">

                                    <img
                                        src={
                                            farm.coverImage ??
                                            "/placeholder-farm.jpg"
                                        }
                                        alt={farm.farmName}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />

                                </div>

                                {/* FARM INFO */}

                                <div className="p-5">

                                    <div className="flex items-start justify-between gap-3">

                                        <h3 className="font-semibold">
                                            {farm.farmName}
                                        </h3>

                                        {farm.trustLevel && (

                                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                                {farm.trustLevel}
                                            </span>

                                        )}

                                    </div>

                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-2">

                                        <MapPin className="w-3 h-3" />

                                        <span className="line-clamp-1">
                                            {farm.address ??
                                                "Chưa cập nhật địa chỉ"}
                                        </span>

                                    </div>

                                    <p className="text-sm mt-2 text-muted-foreground line-clamp-2">

                                        {farm.description ??
                                            "Nông trại đối tác GreenFarmer"}

                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <p className="text-muted-foreground">
                        Chưa có nông trại đối tác.
                    </p>

                )}

            </section>

            <section className="max-w-7xl mx-auto px-4 py-16">

                <div className="rounded-3xl bg-hero-gradient text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">

                    <div>

                        <h3 className="text-2xl md:text-3xl font-bold">
                            Bạn là nông dân?
                        </h3>

                        <p className="opacity-90 mt-2">
                            Đăng ký bán hàng và xây dựng thương hiệu
                            nông sản uy tín cùng GreenFarmer.
                        </p>

                    </div>

                    <Link
                        to="/auth/register"
                        className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/95 shadow-lg"
                    >
                        Đăng ký ngay
                    </Link>

                </div>

            </section>
        </>
    );
}