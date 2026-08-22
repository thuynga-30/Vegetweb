import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { paymentService } from "@/services/paymentService";

export default function PaymentResultPage() {
    const location = useLocation();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [message, setMessage] = useState("");
    const [orderId, setOrderId] = useState<number | null>(null);

    useEffect(() => {
        paymentService
            .verifyVnpayReturn(location.search)
            .then((res) => {
                setMessage(res.message);
                setOrderId(res.orderId ?? null);
                setStatus(res.success ? "success" : "failed");
            })
            .catch(() => setStatus("failed"));
    }, [location.search]);

    return (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
            {status === "loading" && <p>Đang xác nhận thanh toán...</p>}
            {status === "success" && (
                <>
                    <h1 className="text-2xl font-bold text-primary mb-2">Thanh toán thành công</h1>
                    <p className="text-muted-foreground mb-6">{message}</p>
                    <Link to={orderId ? `/orders/${orderId}` : "/orders"} className="text-primary font-medium">
                        Xem đơn hàng của bạn →
                    </Link>
                </>
            )}
            {status === "failed" && (
                <>
                    <h1 className="text-2xl font-bold text-destructive mb-2">Thanh toán thất bại</h1>
                    <p className="text-muted-foreground mb-6">{message}</p>
                    <Link to="/checkout" className="text-primary font-medium">Thử lại →</Link>
                </>
            )}
        </div>
    );
}