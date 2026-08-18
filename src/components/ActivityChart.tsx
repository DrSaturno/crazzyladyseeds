import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { hora: "8hs", msgs: 3 },
  { hora: "9hs", msgs: 6 },
  { hora: "10hs", msgs: 9 },
  { hora: "11hs", msgs: 14 },
  { hora: "12hs", msgs: 11 },
  { hora: "13hs", msgs: 5 },
  { hora: "14hs", msgs: 10 },
  { hora: "15hs", msgs: 16 },
  { hora: "16hs", msgs: 19 },
  { hora: "17hs", msgs: 13 },
  { hora: "18hs", msgs: 8 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-900 border border-navy-500 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
        <p className="text-slate-400">{label}</p>
        <p className="font-semibold">{payload[0].value} mensajes</p>
      </div>
    );
  }
  return null;
};

export default function ActivityChart() {
  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold text-white mb-4">Actividad del día</h2>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ left: -20, right: 10 }}>
          <defs>
            <linearGradient id="colorMsgs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C026D3" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C026D3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="hora" tick={{ fill: "#ffffff", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#ffffff", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="msgs" stroke="#C026D3" strokeWidth={2} fill="url(#colorMsgs)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
