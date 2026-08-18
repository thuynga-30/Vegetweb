import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Search} from "lucide-react";

import {useFetch} from "@/hooks/useFetch";
import {productService} from "@/services/productService";
import {categoryService} from "@/services/categoryService";

import {ProductCard} from "@/components/common/ProductCard";

import {categoryEmoji, categoryColor} from "@/lib/utils";

import type {TrustLevel} from "@/types/batch";

const TRUST_LEVELS: {
    value: TrustLevel;
    label: string;
}[] = [
    {
        value: "High",
        label: "Cấp 3 — Chứng nhận & Xác minh toàn diện",
    },
    {
        value: "Medium",
        label: "Cấp 2 — Nhật ký canh tác đầy đủ",
    },
    {
        value: "Low",
        label: "Cấp 1 — Đã xác minh cơ bản",
    },
];

type SortOption =
    | "newest"
    | "price_asc"
    | "price_desc";

export default function ProductListPage() {
    const [params, setParams] = useSearchParams();

    const [keyword, setKeyword] = useState(
        params.get("search") ?? ""
    );

    const category = params.get("category") ?? "";

    const [trustLevels, setTrustLevels] =
        useState<TrustLevel[]>([
            "High",
            "Medium",
            "Low",
        ]);

    const [sort, setSort] =
        useState<SortOption>("newest");

    const {
        data: categories,
        loading: categoryLoading,
    } = useFetch(
        () => categoryService.getAll(),
        []
    );

    const {
        data: productResponse,
        loading: productLoading,
        error: productError,
    } = useFetch(
        () =>
            productService.getAll({
                search: keyword || undefined,

                categoryId: category
                    ? Number(category)
                    : undefined,

                batchTrustLevel:
                    trustLevels.length === 1
                        ? trustLevels[0]
                        : undefined,

                sort,

                page: 1,

                limit: 12,
            }),
        [keyword, category, trustLevels, sort]
    );

    const setCategory = (id: string) => {
        setParams((current) => {
            const next = new URLSearchParams(current);

            if (id) {
                next.set("category", id);
            } else {
                next.delete("category");
            }

            return next;
        });
    };
    const toggleTrustLevel = (
        level: TrustLevel
    ) => {
        setTrustLevels((prev) =>
            prev.includes(level)
                ? prev.filter((l) => l !== level)
                : [...prev, level]
        );
    };

    const handleSearch = (
        value: string
    ) => {
        setKeyword(value);

        setParams((current) => {
            const next = new URLSearchParams(current);

            if (value.trim()) {
                next.set(
                    "search",
                    value.trim()
                );
            } else {
                next.delete("search");
            }

            return next;
        });
    };

    const products =
        productResponse?.data ?? [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            <div>
                <h1 className="text-3xl font-bold">
                    Sản phẩm
                </h1>

                <p className="text-muted-foreground mt-1">
                    Nông sản đã được xác minh nguồn gốc
                    từ các trang trại đối tác.
                </p>
            </div>

            <div className="mt-6 grid md:grid-cols-[240px_1fr] gap-6 items-start">


                <aside className="space-y-4">



                    <div className="bg-card border rounded-2xl p-4">

                        <h3 className="font-semibold text-sm mb-3">
                            Danh mục
                        </h3>

                        {categoryLoading ? (
                            <p className="text-sm text-muted-foreground">
                                Đang tải danh mục...
                            </p>
                        ) : (
                            <div className="space-y-1">

                                <button
                                    onClick={() =>
                                        setCategory("")
                                    }
                                    className={` w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition
                                        ${
                                        category === ""
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "hover:bg-muted/60"
                                    }
                                    `}
                                >
                                    Tất cả
                                </button>

                                {categories?.map(
                                    (c) => (
                                        <button
                                            key={c.id}
                                            onClick={() =>
                                                setCategory(
                                                    String(c.id)
                                                )
                                            }
                                            className={`
                                                w-full
                                                text-left
                                                px-3 py-2
                                                rounded-lg
                                                text-sm
                                                flex
                                                items-center
                                                gap-2
                                                transition
                                                ${
                                                category ===
                                                String(c.id)
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-muted/60"
                                            }
                                            `}
                                        >

                                            <span
                                                className={`
                                                    w-6 h-6
                                                    rounded-full
                                                    grid
                                                    place-items-center
                                                    text-xs
                                                    shrink-0
                                                    ${categoryColor(
                                                    c.name
                                                )}
                                                `}
                                            >
                                                {categoryEmoji(
                                                    c.name
                                                )}
                                            </span>

                                            {c.name}

                                        </button>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                    <div className="bg-card border rounded-2xl p-4">

                        <h3 className="font-semibold text-sm mb-3">
                            Cấp độ tin cậy
                        </h3>

                        <div className="space-y-2">

                            {TRUST_LEVELS.map(
                                (t) => (
                                    <label
                                        key={t.value}
                                        className="flex items-start gap-2 text-sm cursor-pointer"
                                    >

                                        <input
                                            type="checkbox"
                                            checked={trustLevels.includes(
                                                t.value
                                            )}
                                            onChange={() =>
                                                toggleTrustLevel(
                                                    t.value
                                                )
                                            }
                                            className="mt-0.5 accent-primary"
                                        />

                                        <span>
                                            {t.label}
                                        </span>

                                    </label>
                                )
                            )}

                        </div>

                    </div>

                </aside>

                <div>

                    <div className="flex flex-col sm:flex-row gap-3">

                        {/* SEARCH */}

                        <div className="relative flex-1">

                            <Search
                                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>

                            <input
                                value={keyword}
                                onChange={(e) =>
                                    handleSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Tìm rau, quả, gạo..."
                                className="
                                    w-full
                                    pl-9 pr-3
                                    py-2.5
                                    rounded-xl
                                    border
                                    bg-background
                                    text-sm
                                "
                            />

                        </div>

                        <select
                            value={sort}
                            onChange={(e) =>
                                setSort(
                                    e.target.value as SortOption
                                )
                            }
                            className="
                                px-3
                                py-2.5
                                rounded-xl
                                border
                                bg-background
                                text-sm
                            "
                        >

                            <option value="newest">
                                Mặc định
                            </option>

                            <option value="price_asc">
                                Giá tăng dần
                            </option>

                            <option value="price_desc">
                                Giá giảm dần
                            </option>

                        </select>

                    </div>

                    {productError && (
                        <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                            Không thể tải danh sách sản phẩm.
                            <br/>
                            {productError}
                        </div>
                    )}

                    {productLoading ? (
                        <div className="py-16 text-center text-muted-foreground">
                            Đang tải sản phẩm...
                        </div>
                    ) : products.length > 0 ? (

                        <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-5">

                            {products.map(
                                (product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                )
                            )}

                        </div>

                    ) : (

                        <div className="py-16 text-center text-muted-foreground">
                            Không tìm thấy sản phẩm phù hợp.
                        </div>

                    )}
                    {!productLoading &&
                        productResponse?.meta && (
                            <div className="mt-6 text-sm text-muted-foreground">
                                Hiển thị{" "}
                                {products.length}{" "}
                                /{" "}
                                {productResponse.meta.total}{" "}
                                sản phẩm
                            </div>
                        )}

                </div>
            </div>
        </div>
    );
}