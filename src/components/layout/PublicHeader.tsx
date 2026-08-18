import { Link, NavLink } from "react-router-dom";
import { Leaf, ShoppingCart, User, ScanLine, LayoutDashboard, Menu } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export function PublicHeader() {
    const { totalItems } = useCart();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const navCls = ({ isActive }: { isActive: boolean }) =>
        `hover:text-primary ${isActive ? "text-primary font-medium" : ""}`;

    return (
        <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                    <div className="w-9 h-9 rounded-xl bg-hero-gradient grid place-items-center text-white">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <span>Green<span className="text-primary">Farmer</span></span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm ml-6">
                    <NavLink to="/" end className={navCls}>Trang chủ</NavLink>
                    <NavLink to="/products" className={navCls}>Sản phẩm</NavLink>
                    <NavLink to="/trace" className="hover:text-primary flex items-center gap-1">
                        <ScanLine className="w-4 h-4" />Truy xuất QR
                    </NavLink>
                    <NavLink to="/orders" className={navCls}>Đơn hàng</NavLink>
                </nav>

                <div className="flex-1" />

                <Link to="/seller" className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
                    <LayoutDashboard className="w-4 h-4" /> Kênh nông dân
                </Link>
                <Link to="/admin" className="hidden md:inline-flex text-xs text-muted-foreground hover:text-primary">Admin</Link>
                <Link to="/cart" className="relative p-2 rounded-lg hover:bg-muted">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] grid place-items-center font-semibold">
              {totalItems}
            </span>
                    )}
                </Link>
                <Link to={user ? "/profile" : "/auth/login"} className="p-2 rounded-lg hover:bg-muted relative">
                    <User className="w-5 h-5" />
                    {user && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />}
                </Link>
                <button onClick={() => setOpen((v) => !v)} className="md:hidden p-2 rounded-lg hover:bg-muted"><Menu className="w-5 h-5" /></button>
            </div>
            {open && (
                <div className="md:hidden border-t px-4 py-3 flex flex-col gap-2 text-sm">
                    <Link to="/" onClick={() => setOpen(false)}>Trang chủ</Link>
                    <Link to="/products" onClick={() => setOpen(false)}>Sản phẩm</Link>
                    <Link to="/trace" onClick={() => setOpen(false)}>Truy xuất QR</Link>
                    <Link to="/orders" onClick={() => setOpen(false)}>Đơn hàng</Link>
                    <Link to="/seller" onClick={() => setOpen(false)}>Kênh nông dân</Link>
                    <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
                </div>
            )}
        </header>
    );
}