import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { useFetch } from "@/hooks/useFetch";
import { orderService } from "@/services/orderService";
import { batchService } from "@/services/batchService";
import { formatDate } from "@/lib/utils";

export default function ReportsPage() {
    const { data: orders } = useFetch(() => orderService.getAll(), []);
    const { data: batches } = useFetch(() => batchService.getAll(), []);

    const monthly = useMemo(() => {
        if (!orders) return [];
        const map = new Map<string, number>();
        orders.forEach((o) => {
            const key = formatDate(o.created_at).slice(3); // MM/YYYY
            map.set(key, (map.get(key) ?? 0) + 1);
        });
        return Array.from(map.entries()).map(([m, orders]) => ({ m, orders }));
    }, [orders]);

    const trustPie = useMemo(() => {
        if (!batches) return [];
        const count = { Low: 0, Medium: 0, High: 0 } as Record<string, number>;
        batches.forEach((b) => { count[b.trust_level] = (count[b.trust_level] ?? 0) + 1; });
        return [
            { name: "Vàng (Cấp 3)", value: count.High, color: "oklch(0.8 0.17 85)" },
            { name: "Bạc (Cấp 2)", value: count.Medium, color: "oklch(0.75 0.02 240)" },
            { name: "Cơ bản (Cấp 1)", value: count.Low, color: "oklch(0.65 0.1 55)" },
        ];
    }, [batches]);

    return (
        <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-card border rounded-2xl p-5">
                <h3 className="font-semibold mb-4">Đơn hàng theo tháng</h3>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={monthly}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="m" /><YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-card border rounded-2xl p-5">
                <h3 className="font-semibold mb-4">Phân bố cấp độ tin cậy</h3>
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie data={trustPie} dataKey="value" innerRadius={45} outerRadius={80}>
                            {trustPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1 text-xs">
                    {trustPie.map((t) => (
                        <div key={t.name} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm" style={{ background: t.color }} /> {t.name}: <b className="ml-auto">{t.value}</b>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
