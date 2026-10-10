import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X } from "lucide-react";

interface Props {
    onScan: (text: string) => void;
    onClose: () => void;
}

// Chỉ mount component này khi cần quét (camera bật khi mount, tắt khi unmount)
export function QRScannerModal({ onScan, onClose }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const onScanRef = useRef(onScan);
    onScanRef.current = onScan;
    const [error, setError] = useState("");

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Tạo vùng hiển thị riêng cho mỗi lần bật camera (tránh xung đột khi React StrictMode chạy effect 2 lần)
        const target = document.createElement("div");
        target.id = `qr-reader-${Math.random().toString(36).slice(2)}`;
        container.appendChild(target);

        const scanner = new Html5Qrcode(target.id);
        let handled = false;

        const starting = scanner
            .start(
                { facingMode: "environment" }, // ưu tiên camera sau trên điện thoại
                {
                    fps: 10,
                    qrbox: (w, h) => {
                        const size = Math.floor(Math.min(w, h) * 0.7);
                        return { width: size, height: size };
                    },
                },
                (decodedText) => {
                    if (handled) return; // chỉ xử lý một lần
                    handled = true;
                    onScanRef.current(decodedText);
                },
                () => { /* bỏ qua lỗi từng khung hình không đọc được */ },
            )
            .catch((err) => {
                const msg = String(err);
                if (/permission|denied|NotAllowed/i.test(msg)) {
                    setError("Bạn chưa cấp quyền truy cập camera. Hãy cho phép camera trong trình duyệt rồi thử lại.");
                } else if (/NotFound|no camera|Requested device not found/i.test(msg)) {
                    setError("Không tìm thấy camera trên thiết bị này.");
                } else {
                    setError("Không mở được camera. Trang cần chạy trên HTTPS hoặc localhost.");
                }
            });

        return () => {
            starting
                .then(() => scanner.stop())
                .catch(() => { /* camera chưa chạy thì bỏ qua */ })
                .finally(() => target.remove());
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-card border rounded-2xl w-full max-w-md p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Quét mã QR</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Đóng"
                        className="p-1.5 rounded-lg hover:bg-muted"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div ref={containerRef} className="w-full overflow-hidden rounded-xl bg-black min-h-[240px]" />

                {error ? (
                    <p className="text-sm text-destructive mt-3 text-center">{error}</p>
                ) : (
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                        Đưa mã QR trên bao bì vào khung hình để quét.
                    </p>
                )}
            </div>
        </div>
    );
}