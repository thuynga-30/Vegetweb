// CategoryPieChart.tsx
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#16a34a", "#ef4444", "#f59e0b", "#78350f", "#3b82f6"];

export function CategoryPieChart({ data }: { data: { name: string; value: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}