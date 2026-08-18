import { Shield, ShieldCheck, Award } from "lucide-react";
import type { TrustLevel } from "@/types/batch";
import { TRUST_LEVEL_LABEL } from "@/lib/constants";

const config: Record<TrustLevel, { icon: typeof Shield; cls: string }> = {
    Low: { icon: Shield, cls: "bg-[color:var(--trust-bronze)]/15 text-[color:var(--trust-bronze)] border-[color:var(--trust-bronze)]/40" },
    Medium: { icon: ShieldCheck, cls: "bg-[color:var(--trust-silver)]/15 text-slate-600 border-slate-400/40" },
    High: { icon: Award, cls: "bg-[color:var(--trust-gold)]/15 text-[color:var(--trust-gold)] border-[color:var(--trust-gold)]/50" },
};

export function TrustBadge({ level, size = "md" }: { level: TrustLevel; size?: "sm" | "md" }) {
    const { icon: Icon, cls } = config[level];
    const px = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${px} ${cls}`}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
            {TRUST_LEVEL_LABEL[level]}
    </span>
    );
}
