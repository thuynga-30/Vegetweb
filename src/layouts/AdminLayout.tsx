import { Outlet, Link, useLocation } from "react-router-dom";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

const TITLES: Record<string, string> = {
    "/admin": "Tổng quan hệ thống",
    "/admin/approvals": "Kiểm duyệt lô hàng",
    "/admin/users": "Quản lý người dùng",
    "/admin/farms": "Quản lý nông trại",
    "/admin/orders": "Đơn hàng toàn hệ thống",
    "/admin/reports": "Báo cáo",
};

export function AdminLayout() {
    const { pathname } = useLocation();
    const title = TITLES[pathname] ?? (pathname.startsWith("/admin/approvals/") ? "Chi tiết kiểm duyệt" : "Quản trị");
    return (
        <div className="min-h-screen bg-muted/30 flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b bg-background flex items-center px-6 gap-4">
                    <h1 className="font-semibold text-lg">{title}</h1>
                    <div className="flex-1" />
                    <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Về trang khách hàng</Link>
                </header>
                <main className="flex-1 p-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
