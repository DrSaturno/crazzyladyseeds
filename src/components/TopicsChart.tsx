import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#C026D3", "#d946ef", "#e879f9", "#22c55e", "#4ade80", "#86efac", "#EAB308"];

interface Props {
  data: { topic: string; count: number }[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-900 border border-navy-500 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
        <p>{payload[0].value} consultas</p>
      </div>
    );
  }
  return null;
};

export default function TopicsChart({ data }: Props) {
  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold text-white mb-4">Temas más consultados</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
          <XAxis type="number" tick={{ fill: "#ffffff", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="topic"
            tick={{ fill: "#ffffff", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
