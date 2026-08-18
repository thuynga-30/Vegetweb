import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star, MessageSquareText, Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { reviewService } from "@/services/reviewService";
import { productService } from "@/services/productService";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { formatDate } from "@/lib/utils";
import type { ReviewItem } from "@/types/product";

function StarRating({
                        value,
                        onChange,
                        size = "w-5 h-5",
                        readOnly = false,
                    }: {
    value: number;
    onChange?: (v: number) => void;
    size?: string;
    readOnly?: boolean;
}) {
    const [hover, setHover] = useState<number | null>(null);

    const display = hover ?? value;

    return (
        <div
            className={`flex items-center gap-0.5 ${
                readOnly ? "" : "cursor-pointer"
            }`}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() =>
                        !readOnly && setHover(star)
                    }
                    onMouseLeave={() =>
                        !readOnly && setHover(null)
                    }
                    className={
                        readOnly
                            ? "cursor-default"
                            : "cursor-pointer"
                    }
                    aria-label={`${star} sao`}
                >
                    <Star
                        className={`${size} ${
                            star <= display
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/40"
                        } transition-colors`}
                    />
                </button>
            ))}
        </div>
    );
}

export function ReviewSection({
                                  productId,
                              }: {
    productId: number;
}) {
    const { user } = useAuth();

    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // =========================
    // LOAD REVIEWS
    // =========================
    const loadReviews = async () => {
        try {
            setLoading(true);

            const response = await productService.getById(productId);

            // productService.getById() trả về ProductDetail
            setReviews(response.reviews?.items ?? []);
        } catch (err) {
            console.error("Không thể tải đánh giá:", err);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [productId]);

    // =========================
    // SORT REVIEWS
    // =========================
    const sortedReviews = useMemo(() => {
        return [...reviews].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    }, [reviews]);

    // =========================
    // AVERAGE RATING
    // =========================
    const avgRating = useMemo(() => {
        if (reviews.length === 0) return 0;

        return (
            reviews.reduce(
                (sum, review) => sum + review.rating,
                0
            ) / reviews.length
        );
    }, [reviews]);

    // =========================
    // SUBMIT REVIEW
    // =========================
    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setError(null);
        setSuccess(false);

        if (rating < 1) {
            setError("Vui lòng chọn số sao đánh giá.");
            return;
        }

        try {
            setSubmitting(true);

            await reviewService.create(productId, {
                rating,
                comment: comment.trim() || undefined,
            });

            setRating(0);
            setComment("");
            setSuccess(true);

            // Tải lại danh sách đánh giá
            await loadReviews();
        } catch (err: any) {
            console.error("Lỗi tạo đánh giá:", err);

            const message =
                err?.response?.data?.message ??
                err?.message ??
                "Có lỗi xảy ra, vui lòng thử lại.";

            setError(
                Array.isArray(message)
                    ? message.join(", ")
                    : message
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-14 border-t pt-10">

            {/* HEADER */}
            <div className="flex items-center gap-2 mb-1">
                <MessageSquareText className="w-5 h-5 text-primary" />

                <h2 className="text-xl font-bold">
                    Đánh giá sản phẩm
                </h2>
            </div>

            {/* RATING SUMMARY */}
            {!loading && reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                    <StarRating
                        value={Math.round(avgRating)}
                        readOnly
                        size="w-4 h-4"
                    />

                    <span className="font-semibold text-foreground">
                        {avgRating.toFixed(1)}/5
                    </span>

                    <span>
                        · {reviews.length} đánh giá
                    </span>
                </div>
            )}

            {/* FORM */}
            <div className="rounded-2xl border bg-muted/30 p-5 mb-8">
                {user ? (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-3"
                    >
                        <div>
                            <div className="text-sm font-medium mb-1.5">
                                Đánh giá của bạn
                            </div>

                            <StarRating
                                value={rating}
                                onChange={setRating}
                            />
                        </div>

                        <Textarea
                            value={comment}
                            onChange={(e) =>
                                setComment(e.target.value)
                            }
                            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                            className="bg-background"
                            rows={3}
                        />

                        {error && (
                            <div className="text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="text-sm text-primary">
                                Cảm ơn bạn đã đánh giá!
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting && (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            )}

                            Gửi đánh giá
                        </Button>
                    </form>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        <Link
                            to="/auth/login"
                            className="text-primary font-medium hover:underline"
                        >
                            Đăng nhập
                        </Link>{" "}
                        để viết đánh giá cho sản phẩm này.
                    </div>
                )}
            </div>

            {/* REVIEW LIST */}
            {loading ? (
                <div className="text-sm text-muted-foreground">
                    Đang tải đánh giá...
                </div>
            ) : sortedReviews.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                    Chưa có đánh giá nào cho sản phẩm này.
                </div>
            ) : (
                <div className="space-y-6">
                    {sortedReviews.map((review) => (
                        <div
                            key={review.id}
                            className="flex gap-3"
                        >
                            <Avatar size="default">
                                <AvatarImage
                                    alt={review.buyerName}
                                />

                                <AvatarFallback>
                                    {(
                                        review.buyerName ?? "U"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">
                                        {review.buyerName ??
                                            "Người dùng"}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(
                                            review.createdAt
                                        )}
                                    </span>
                                </div>

                                <StarRating
                                    value={review.rating}
                                    readOnly
                                    size="w-3.5 h-3.5"
                                />

                                {review.comment && (
                                    <p className="text-sm mt-1.5 text-foreground/90">
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}