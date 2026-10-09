import { QRCodeSVG } from "qrcode.react";

export function QRCode({ value, size = 160 }: { value: string; size?: number }) {
    return (
        <div className="inline-block rounded-lg bg-white p-2 shadow-sm">
            <QRCodeSVG value={value} size={size} level="M" />
        </div>
    );
}