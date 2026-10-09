export function buildTraceUrl(barcode: string): string {
    const base = import.meta.env.VITE_PUBLIC_URL ?? window.location.origin;
    return `${base}/trace?code=${barcode}`;
}