import { Link, NavLink } from "react-router-dom";
import { Leaf, Home, CheckSquare, Users, MapPin, ClipboardList, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menu = [
    { to: "/admin", label: "Tổng quan", icon: Home, end: true },
    { to: "/admin/approvals", label: "Kiểm duyệt lô hàng", icon: CheckSquare },
    { to: "/admin/users", label: "Người dùng", icon: Users },
    { to: "/admin/farms", label: "Nông trại", icon: MapPin },
    { to: "/admin/orders", label: "Đơn hàng", icon: ClipboardList },
    { to: "/admin/reports", label: "Báo cáo", icon: BarChart3 },
];

export function AdminSidebar() {
    const { user, logout } = useAuth();
    return (
        <aside className="w-64 bg-sidebar text-sidebar-foreground flex-col hidden md:flex">
            <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-sidebar-border/40">
                <div className="w-8 h-8 rounded-lg bg-hero-gradient grid place-items-center"><Leaf className="w-4 h-4 text-white" /></div>
                <span className="font-bold">GreenFarmer</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sidebar-primary/20 text-sidebar-primary uppercase">admin</span>
            </Link>
            <nav className="p-3 flex-1 space-y-1">
                {menu.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" : "hover:bg-sidebar-accent"
                            }`
                        }
                    >
                        <Icon className="w-4 h-4" /> {label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-sidebar-border/40">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sidebar-primary/30 grid place-items-center font-semibold">
                        {user?.full_name?.[0] ?? "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{user?.full_name ?? "Quản trị viên"}</div>
                        <div className="text-xs opacity-70 truncate">Quản trị hệ thống</div>
                    </div>
                    <button onClick={logout} className="p-1.5 rounded hover:bg-sidebar-accent"><LogOut className="w-4 h-4" /></button>
                </div>
            </div>
        </aside>
    );
}
