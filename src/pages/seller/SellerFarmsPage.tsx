import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { farmService } from "@/services/farmService";
import { StatusBadge } from "@/components/common/StatusBadge";
import { MapPin } from "lucide-react";

export default function SellerFarmsPage() {
    const { data: farms, loading } = useFetch(() => farmService.getMyFarms(), []);

    if (loading) return <p className="text-muted-foreground">Đang tải...</p>;

    return (
        <div className="grid md:grid-cols-3 gap-4">
            {farms?.map((f) => (
                <Link
                    key={f.id}
                    to={`/seller/farms/${f.id}`}
                    className="bg-card border rounded-2xl overflow-hidden hover:border-primary transition"
                >
                    {f.coverImage ? (
                        <img
                            src={f.coverImage}
                            className="aspect-video w-full object-cover bg-muted"
                            alt={f.farmName}
                        />
                    ) : (
                        <div className="aspect-video w-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                            Chưa có ảnh
                        </div>
                    )}

                    <div className="p-5">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold">{f.farmName}</h3>
                            <StatusBadge
                                status={
                                    f.status === "approved"
                                        ? "Approved"
                                        : f.status === "rejected"
                                            ? "Rejected"
                                            : "Pending"
                                }
                            />
                        </div>

                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {f.address || "Chưa cập nhật địa chỉ"}
                        </div>

                        <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                            {f.description}
                        </p>
                    </div>
                </Link>
            ))}

            {(!farms || farms.length === 0) && (
                <p className="text-sm text-muted-foreground col-span-3 text-center py-10">
                    Bạn chưa có trang trại nào.
                </p>
            )}
        </div>
    );
}