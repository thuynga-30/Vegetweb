import { Outlet, Link, useLocation } from "react-router-dom";
import { SellerSidebar } from "@/components/layout/SellerSidebar";

const TITLES: Record<string, string> = {
    "/seller": "Tổng quan",
    "/seller/farm": "Hồ sơ trang trại",
    "/seller/batches": "Lô hàng",
    "/seller/batches/new": "Tạo lô hàng mới",
    "/seller/orders": "Đơn hàng",
};

export function SellerLayout() {
    const { pathname } = useLocation();
    const title = TITLES[pathname] ?? (pathname.startsWith("/seller/batches/") ? "Chi tiết lô hàng" : "Kênh nông dân");
    return (
        <div className="min-h-screen bg-muted/30 flex">
            <SellerSidebar />
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
