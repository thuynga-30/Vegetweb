import { useMemo, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { userService } from "@/services/userService";
import { farmService } from "@/services/farmService";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { USER_STATUS_LABEL, USER_STATUS_COLOR } from "@/lib/constants";
import { Link } from "react-router-dom";
import { Check, X, ChevronDown, MapPin, Award, ArrowRight, Ban, RotateCcw } from "lucide-react";
import type { UserRole } from "@/types/user";

export default function UsersPage() {
    const [role, setRole] = useState<UserRole | "">("");
    const { data: users, loading, refetch: refetchUsers } = useFetch(() => userService.getAll(role || undefined), [role]);
    const { data: farms, refetch: refetchFarms } = useFetch(() => farmService.getAll(), []);

    const [expanded, setExpanded] = useState<number | null>(null);
    const [actingId, setActingId] = useState<number | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const farmBySeller = useMemo(() => {
        const map = new Map<number, NonNullable<typeof farms>[number]>();
        farms?.forEach((f) => map.set(f.seller_id, f));
        return map;
    }, [farms]);

    const act = async (farmId: number, action: "approve" | "reject") => {
        setActingId(farmId);
        try {
            if (action === "approve") await farmService.approve(farmId);
            else await farmService.reject(farmId, "Hồ sơ nông trại chưa đủ minh chứng");
            refetchFarms();
        } finally {
            setActingId(null);
        }
    };

    const toggleStatus = async (userId: number, currentStatus?: string) => {
        const isDisabled = currentStatus === "Disabled";
        const confirmMsg = isDisabled
            ? "Kích hoạt lại tài khoản này?"
            : "Vô hiệu hóa tài khoản này? Người dùng sẽ không thể đăng nhập.";
        if (!window.confirm(confirmMsg)) return;
        setTogglingId(userId);
        try {
            if (isDisabled) await userService.enable(userId);
            else await userService.disable(userId);
            refetchUsers();
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-5">
                {(["", "Admin", "Seller", "Buyer"] as const).map((r) => (
                    <button key={r} onClick={() => setRole(r)}
                            className={`px-4 py-1.5 rounded-full text-sm ${role === r ? "bg-primary text-primary-foreground" : "border"}`}>
                        {r === "" ? "Tất cả" : r}
                    </button>
                ))}
            </div>
            <div className="bg-card border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                        <th className="text-left p-3">Tên</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">SĐT</th>
                        <th className="text-left p-3">Vai trò</th>
                        <th className="text-left p-3">Nông trại</th>
                        <th className="text-left p-3">Trạng thái TK</th>
                        <th className="text-left p-3">Ngày tạo</th>
                        <th className="text-right p-3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users?.map((u) => {
                        const farm = u.role === "Seller" ? farmBySeller.get(u.id) : undefined;
                        const isOpen = expanded === u.id;
                        const isDisabled = u.status === "Disabled";
                        return (
                            <>
                                <tr
                                    key={u.id}
                                    className={`border-t ${farm ? "cursor-pointer hover:bg-muted/30" : ""} ${isDisabled ? "opacity-60" : ""}`}
                                    onClick={() => farm && setExpanded(isOpen ? null : u.id)}
                                >
                                    <td className="p-3 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-semibold">{u.full_name[0]}</div>
                                        {u.full_name}
                                    </td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">{u.phone}</td>
                                    <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted">{u.role}</span></td>
                                    <td className="p-3">
                                        {farm ? (
                                            <div className="flex items-center gap-2">
                                                <StatusBadge status={farm.approval_status ?? "Pending"} />
                                                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${USER_STATUS_COLOR[u.status ?? "Active"]}`}>
                                            {USER_STATUS_LABEL[u.status ?? "Active"]}
                                        </span>
                                    </td>
                                    <td className="p-3">{formatDate(u.created_at)}</td>
                                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end gap-2">
                                            {farm && farm.approval_status === "Pending" && (
                                                <>
                                                    <button
                                                        disabled={actingId === farm.id}
                                                        onClick={() => act(farm.id, "approve")}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 disabled:opacity-50"
                                                    >
                                                        <Check className="w-3.5 h-3.5" /> Duyệt
                                                    </button>
                                                    <button
                                                        disabled={actingId === farm.id}
                                                        onClick={() => act(farm.id, "reject")}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 disabled:opacity-50"
                                                    >
                                                        <X className="w-3.5 h-3.5" /> Từ chối
                                                    </button>
                                                </>
                                            )}
                                            {u.role !== "Admin" && (
                                                isDisabled ? (
                                                    <button
                                                        disabled={togglingId === u.id}
                                                        onClick={() => toggleStatus(u.id, u.status)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 disabled:opacity-50"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" /> Kích hoạt lại
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled={togglingId === u.id}
                                                        onClick={() => toggleStatus(u.id, u.status)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 disabled:opacity-50"
                                                    >
                                                        <Ban className="w-3.5 h-3.5" /> Vô hiệu hóa
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                {farm && isOpen && (
                                    <tr className="border-t bg-muted/20">
                                        <td colSpan={8} className="p-4">
                                            <div className="flex gap-4">
                                                <img src={farm.image} alt="" className="w-28 h-20 rounded-lg object-cover flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold">{farm.farm_name}</div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                        <MapPin className="w-3 h-3" /> {farm.address}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1.5">{farm.description}</p>
                                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                        {farm.certifications?.map((c) => (
                                                            <span key={c.name} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-card border">
                                  <Award className="w-3 h-3 text-primary" /> {c.name}
                                </span>
                                                        ))}
                                                        {farm.area_ha && (
                                                            <span className="text-xs text-muted-foreground">Diện tích: {farm.area_ha}ha</span>
                                                        )}
                                                    </div>
                                                    <Link
                                                        to={`/admin/farms/${farm.id}`}
                                                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-3"
                                                    >
                                                        Xem hồ sơ đầy đủ (giấy tờ, chứng nhận...) <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        );
                    })}
                    </tbody>
                </table>
                {!loading && (!users || users.length === 0) && (
                    <p className="text-sm text-muted-foreground p-6 text-center">Không có người dùng nào.</p>
                )}
            </div>
        </div>
    );
}