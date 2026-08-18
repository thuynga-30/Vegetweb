import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL, APPROVAL_STATUS_COLOR, APPROVAL_STATUS_LABEL } from "@/lib/constants";
import type { OrderStatus } from "@/types/order";
import type { ApprovalStatus } from "@/types/batch";

export function StatusBadge({ status }: { status: OrderStatus | ApprovalStatus }) {
    const cls =
        (ORDER_STATUS_COLOR as Record<string, string>)[status] ??
        (APPROVAL_STATUS_COLOR as Record<string, string>)[status] ??
        "bg-muted text-muted-foreground";
    const label =
        (ORDER_STATUS_LABEL as Record<string, string>)[status] ??
        (APPROVAL_STATUS_LABEL as Record<string, string>)[status] ??
        status;
    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cls}`}>{label}</span>
    );
}
