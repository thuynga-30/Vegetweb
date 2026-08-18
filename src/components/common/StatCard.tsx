import type { ReactNode } from "react";

export function StatCard({ icon, label, value, sub, highlight }: {
    icon: ReactNode; label: string; value: string; sub?: string; highlight?: boolean;
}) {
    return (
        <div className={`bg-card border rounded-2xl p-5 ${highlight ? "ring-2 ring-amber-400/40" : ""}`}>
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center">{icon}</div>
                <div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-xl font-bold">{value}</div>
                </div>
            </div>
            {sub && <div className="text-xs text-muted-foreground mt-3">{sub}</div>}
        </div>
    );
}
