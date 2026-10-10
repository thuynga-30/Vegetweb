import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { batchService } from "@/services/batchService";
import { formatDate } from "@/lib/utils";
import { TrustBadge } from "@/components/common/TrustBadge";
import { QRCode } from "@/components/common/QRCode";
import { QRScannerModal } from "@/components/common/QRScannerModal";
import { ScanLine, MapPin, CheckCircle2 } from "lucide-react";
import type { BatchTraceData } from "@/types/batch";

// Nội dung QR có thể là mã lô thuần ("GF-XLR-2026-001") hoặc một đường link có tham số ?code=...
function extractBatchCode(raw: string): string {
    const text = raw.trim();
    try {
        const url = new URL(text);
        return url.searchParams.get("code")?.trim() || text;
    } catch {
        return text;
    }
}

export default function TraceabilityPage() {
    const [params] = useSearchParams();

    const initialCode = params.get("code") ?? "";

    const [code, setCode] = useState(initialCode);
    const [searched, setSearched] = useState(initialCode);

    const [data, setData] = useState<BatchTraceData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [scanning, setScanning] = useState(false);

    const search = async (value: string) => {
        const batchCode = value.trim();

        if (!batchCode) {
            setError("Vui lòng nhập mã lô hàng.");
            return;
        }

        setLoading(true);
        setError("");
        setData(null);

        try {
            const response = await batchService.getTraceByCode(batchCode);

            console.log("Traceability response:", response);

            setData(response);
            setSearched(batchCode);
        } catch (err: any) {
            console.error("Traceability error:", err);

            setData(null);

            setError(
                err?.message ??
                err?.error ??
                "Không tìm thấy lô hàng với mã này."
            );
        } finally {
            setLoading(false);
        }
    };

    // Mở trang bằng link có ?code=... (ví dụ quét QR bằng camera điện thoại) thì tra cứu luôn
    useEffect(() => {
        if (initialCode) search(initialCode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Quét QR xong: đóng camera, điền mã vào ô nhập và tra cứu
    const handleScan = (text: string) => {
        setScanning(false);
        const value = extractBatchCode(text);
        setCode(value);
        search(value);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-14">

            {/* HEADER */}
            <div className="text-center">

                <button
                    type="button"
                    onClick={() => setScanning(true)}
                    aria-label="Quét mã QR"
                    title="Quét mã QR"
                    className="w-14 h-14 rounded-2xl bg-hero-gradient text-white grid place-items-center mx-auto hover:opacity-90 transition"
                >
                    <ScanLine className="w-7 h-7" />
                </button>

                <h1 className="text-3xl font-bold mt-4">
                    Truy xuất nguồn gốc
                </h1>

                <p className="text-muted-foreground mt-1">
                    Nhập mã lô hàng in trên bao bì
                    (VD: GF-XLR-2026-001) hoặc quét mã QR.
                </p>

            </div>

            {/* SEARCH */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    search(code);
                }}
                className="mt-6 flex gap-2"
            >
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Nhập mã lô hàng..."
                    className="flex-1 px-4 py-3 rounded-xl border bg-background"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                    {loading ? "Đang tìm..." : "Tra cứu"}
                </button>
            </form>

            {/* ERROR */}
            {error && (
                <p className="text-sm text-destructive mt-3 text-center">
                    {error}
                </p>
            )}

            {/* RESULT */}
            {data && (
                <div className="mt-10 space-y-6">

                    {/* THÔNG TIN LÔ HÀNG */}
                    <div className="bg-card border rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">

                        {/* QR */}
                        <div className="mx-auto md:mx-0">
                            <QRCode value={searched} />
                        </div>

                        {/* INFO */}
                        <div className="flex-1">

                            <div className="flex items-center gap-2">
                                <TrustBadge
                                    level={data.trustLevel}
                                />

                                {data.isFullyVerified && (
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                )}
                            </div>

                            {/* MÃ LÔ */}
                            <div className="font-mono text-sm text-muted-foreground mt-2">
                                {data.batchCode}
                            </div>

                            {/* TÊN SẢN PHẨM */}
                            <h2 className="font-semibold text-xl mt-2">
                                {data.productName}
                            </h2>

                            {/* FARM */}
                            <h3 className="font-medium mt-2">
                                {data.farm?.farmName ??
                                    "Chưa có thông tin nông trại"}
                            </h3>

                            {/* ADDRESS */}
                            {data.farm?.address && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                    <MapPin className="w-4 h-4" />
                                    {data.farm.address}
                                </div>
                            )}

                            {/* DATES */}
                            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">

                                <div className="p-3 rounded-lg bg-muted/50">
                                    <div className="text-muted-foreground">
                                        Gieo trồng
                                    </div>

                                    <b>
                                        {formatDate(data.plantingDate)}
                                    </b>
                                </div>

                                <div className="p-3 rounded-lg bg-muted/50">
                                    <div className="text-muted-foreground">
                                        Thu hoạch
                                    </div>

                                    <b>
                                        {formatDate(data.harvestDate)}
                                    </b>
                                </div>

                            </div>

                        </div>
                    </div>

                    {/* NHẬT KÝ CANH TÁC */}
                    <div className="bg-card border rounded-2xl p-6">

                        <h3 className="font-semibold mb-4">
                            Nhật ký canh tác
                        </h3>

                        {data.cultivationLogs.length === 0 ? (

                            <p className="text-sm text-muted-foreground">
                                Chưa có nhật ký canh tác.
                            </p>

                        ) : (

                            <ol className="relative border-l-2 border-primary/20 ml-2 space-y-5">

                                {data.cultivationLogs.map((log) => (

                                    <li
                                        key={log.id}
                                        className="ml-5"
                                    >

                                        <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20" />

                                        <div className="text-xs text-muted-foreground">
                                            {formatDate(log.log_date)}
                                        </div>

                                        <div className="font-medium">
                                            {log.activity}
                                        </div>

                                        {log.description && (
                                            <div className="text-sm text-muted-foreground">
                                                {log.description}
                                            </div>
                                        )}

                                        {log.image && (
                                            <img
                                                src={log.image}
                                                alt=""
                                                className="mt-2 rounded-lg w-40 h-24 object-cover"
                                            />
                                        )}

                                    </li>

                                ))}

                            </ol>

                        )}

                    </div>

                    {/* HÌNH ẢNH */}
                    {data.images.length > 0 && (

                        <div className="bg-card border rounded-2xl p-6">

                            <h3 className="font-semibold mb-3">
                                Hình ảnh thực tế
                            </h3>

                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">

                                {data.images.map((image, index) => (

                                    <img
                                        key={`${image}-${index}`}
                                        src={image}
                                        className="w-full aspect-square rounded-lg object-cover"
                                        alt={`Hình ảnh lô hàng ${index + 1}`}
                                    />

                                ))}

                            </div>

                        </div>

                    )}

                </div>
            )}

            {/* CAMERA QUÉT QR */}
            {scanning && (
                <QRScannerModal
                    onScan={handleScan}
                    onClose={() => setScanning(false)}
                />
            )}

        </div>
    );
}