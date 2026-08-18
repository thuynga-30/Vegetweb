import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export function PublicFooter() {
    return (
        <footer className="border-t bg-sidebar text-sidebar-foreground mt-16">
            <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
                <div>
                    <div className="flex items-center gap-2 font-bold text-base mb-3">
                        <Leaf className="w-5 h-5 text-primary-glow" /> GreenFarmer
                    </div>
                    <p className="opacity-80">Nền tảng thương mại nông sản truy xuất nguồn gốc, kết nối nông dân với người tiêu dùng.</p>
                </div>
                <div>
                    <div className="font-semibold mb-3">Khám phá</div>
                    <ul className="space-y-2 opacity-80">
                        <li><Link to="/products">Sản phẩm</Link></li>
                        <li><Link to="/trace">Truy xuất QR</Link></li>
                        <li><Link to="/orders">Đơn hàng của tôi</Link></li>
                    </ul>
                </div>
                <div>
                    <div className="font-semibold mb-3">Dành cho nông dân</div>
                    <ul className="space-y-2 opacity-80">
                        <li><Link to="/auth/register">Đăng ký bán hàng</Link></li>
                        <li><Link to="/seller">Kênh nông dân</Link></li>
                    </ul>
                </div>
                <div>
                    <div className="font-semibold mb-3">Liên hệ</div>
                    <ul className="space-y-2 opacity-80">
                        <li>hello@greenfarmer.vn</li>
                        <li>1900 1234</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-sidebar-border/50 py-4 text-center text-xs opacity-70">
                © {new Date().getFullYear()} GreenFarmer — Đồ án TTDN
            </div>
        </footer>
    );
}
