import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { farmService } from "@/services/farmService";
import { StatusBadge } from "@/components/common/StatusBadge";
import { MapPin } from "lucide-react";

export default function FarmsPage() {
    const { data: farms, loading } = useFetch(() => farmService.getAll(), []);

    return (
        <div className="grid md:grid-cols-3 gap-4">
            {farms?.map((f) => (
                <Link key={f.id} to={`/admin/farms/${f.id}`} className="bg-card border rounded-2xl overflow-hidden hover:border-primary transition">
                    <img src={f.image} className="aspect-video w-full object-cover bg-muted" alt="" />
                    <div className="p-5">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold">{f.farm_name}</h3>
                            <StatusBadge status={f.approval_status ?? "Pending"} />
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{f.address}</div>
                        <div className="mt-2 text-xs">Chủ: <b>{f.owner_name}</b></div>
                        <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{f.description}</p>
                    </div>
                </Link>
            ))}
            {!loading && (!farms || farms.length === 0) && (
                <p className="text-sm text-muted-foreground col-span-3 text-center py-10">Chưa có nông trại nào đăng ký.</p>
            )}
        </div>
    );
}