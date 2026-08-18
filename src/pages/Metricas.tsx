import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Rango = "hoy" | "7d" | "15d" | "30d" | "custom";

const HOY_DATA = [
  { hora: "08hs", convs: 2, tokens: 1400, costo: 0.0006 },
  { hora: "09hs", convs: 5, tokens: 3200, costo: 0.0013 },
  { hora: "10hs", convs: 7, tokens: 4600, costo: 0.0018 },
  { hora: "11hs", convs: 11, tokens: 7100, costo: 0.0029 },
  { hora: "12hs", convs: 13, tokens: 8400, costo: 0.0034 },
  { hora: "13hs", convs: 9, tokens: 5900, costo: 0.0024 },
  { hora: "14hs", convs: 12, tokens: 7800, costo: 0.0031 },
  { hora: "15hs", convs: 14, tokens: 9200, costo: 0.0037 },
  { hora: "16hs", convs: 10, tokens: 6500, costo: 0.0026 },
  { hora: "17hs", convs: 8, tokens: 5100, costo: 0.0021 },
];

const DAILY_7 = [
  { fecha: "12/08", convs: 11, respuestas: 38, tokens: 7400, costo: 0.0030 },
  { fecha: "13/08", convs: 15, respuestas: 51, tokens: 9800, costo: 0.0040 },
  { fecha: "14/08", convs: 13, respuestas: 44, tokens: 8600, costo: 0.0035 },
  { fecha: "15/08", convs: 19, respuestas: 67, tokens: 12300, costo: 0.0050 },
  { fecha: "16/08", convs: 17, respuestas: 58, tokens: 10900, costo: 0.0044 },
  { fecha: "17/08", convs: 21, respuestas: 74, tokens: 13800, costo: 0.0056 },
  { fecha: "18/08", convs: 18, respuestas: 61, tokens: 11700, costo: 0.0047 },
];

const DAILY_15 = [
  { fecha: "03/08", convs: 8, respuestas: 27, tokens: 5600, costo: 0.0023 },
  { fecha: "04/08", convs: 10, respuestas: 34, tokens: 6900, costo: 0.0028 },
  { fecha: "05/08", convs: 12, respuestas: 41, tokens: 8100, costo: 0.0033 },
  { fecha: "06/08", convs: 9, respuestas: 30, tokens: 6200, costo: 0.0025 },
  { fecha: "07/08", convs: 14, respuestas: 48, tokens: 9500, costo: 0.0038 },
  { fecha: "08/08", convs: 11, respuestas: 37, tokens: 7600, costo: 0.0031 },
  { fecha: "09/08", convs: 9, respuestas: 31, tokens: 6400, costo: 0.0026 },
  ...DAILY_7,
];

const DAILY_30 = [
  ...Array.from({ length: 15 }, (_, i) => ({
    fecha: `${19 + i}/07`, convs: Math.floor(5 + Math.random() * 12),
    respuestas: Math.floor(18 + Math.random() * 35), tokens: Math.floor(3500 + Math.random() * 8000),
    costo: parseFloat((0.0015 + Math.random() * 0.0035).toFixed(4)),
  })),
  ...DAILY_15,
];

const TOPICS_DATA = [
  { topic: "Automáticas", count: 47 },
  { topic: "Envíos", count: 38 },
  { topic: "Fotoperiódicas", count: 29 },
  { topic: "Esquejes", count: 24 },
  { topic: "REPROCANN", count: 21 },
  { topic: "INASE / legalidad", count: 14 },
];

const DATA_MAP: Record<Rango, typeof DAILY_7> = {
  hoy: HOY_DATA as any,
  "7d": DAILY_7,
  "15d": DAILY_15,
  "30d": DAILY_30,
  custom: DAILY_7,
};

const KEY_MAP: Record<Rango, string> = {
  hoy: "hora",
  "7d": "fecha",
  "15d": "fecha",
  "30d": "fecha",
  custom: "fecha",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-navy-900 border border-navy-500 rounded-lg px-3 py-2 text-xs shadow-lg">
        <p className="text-white/50 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">{p.name}: {typeof p.value === "number" && p.value < 1 ? `$${p.value.toFixed(4)}` : p.value.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

const RANGOS: { key: Rango; label: string }[] = [
  { key: "hoy", label: "Hoy" },
  { key: "7d", label: "7 días" },
  { key: "15d", label: "15 días" },
  { key: "30d", label: "30 días" },
  { key: "custom", label: "Personalizado" },
];

export default function Metricas() {
  const [rango, setRango] = useState<Rango>("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const data = DATA_MAP[rango];
  const xKey = KEY_MAP[rango];

  const totals = data.reduce((a: any, d: any) => ({
    convs: (a.convs || 0) + (d.convs || 0),
    respuestas: (a.respuestas || 0) + (d.respuestas || 0),
    tokens: (a.tokens || 0) + (d.tokens || 0),
    costo: parseFloat(((a.costo || 0) + (d.costo || 0)).toFixed(4)),
  }), {});

  const avgResolucion = 84;
  const avgTiempo = "1.8 min";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-navy-500 bg-navy-900 px-6 py-4 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Métricas</h1>
          <p className="text-xs text-white/50 mt-0.5">Actividad histórica de Emma — los 4 canales combinados</p>
        </div>
        <div className="flex items-center gap-2 bg-navy-800 border border-navy-500 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold text-green-400">Emma · Activa</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-navy-800">

        {/* Filter row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Período:</span>
          {RANGOS.map((r) => (
            <button
              key={r.key}
              onClick={() => setRango(r.key)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition ${
                rango === r.key
                  ? "border-cls-primary bg-cls-primary/15 text-cls-primary"
                  : "border-navy-500 text-white/50 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
          {rango === "custom" && (
            <div className="flex items-center gap-2 ml-2">
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
                className="bg-navy-700 border border-navy-500 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-cls-primary" />
              <span className="text-white/30 text-xs">→</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
                className="bg-navy-700 border border-navy-500 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-cls-primary" />
            </div>
          )}
          <div className="ml-auto flex gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg border border-navy-500 text-white/40 hover:text-green-400 hover:border-green-700 transition">↓ CSV</button>
            <button className="text-xs px-3 py-1.5 rounded-lg border border-navy-500 text-white/40 hover:text-red-400 hover:border-red-700 transition">↓ PDF</button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <MetCard label="Conversaciones" value={totals.convs?.toLocaleString()} icon="💬" color="cls" />
          <MetCard label="Respuestas de Emma" value={totals.respuestas?.toLocaleString()} icon="🌱" color="blue" />
          <MetCard label="Tasa resolución" value={`${avgResolucion}%`} icon="✅" color="green" />
          <MetCard label="Tiempo promedio" value={avgTiempo} icon="⏱️" color="purple" />
          <MetCard label="Tokens usados" value={`${(totals.tokens / 1000).toFixed(1)}k`} icon="🔤" color="amber" />
          <MetCard label="Costo estimado" value={`$${totals.costo?.toFixed(4)}`} icon="💰" color="emerald" />
        </div>

        {/* Charts row 1: conversaciones + tokens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Conversaciones por {rango === "hoy" ? "hora" : "día"}</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C026D3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C026D3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b1b1b" />
                <XAxis dataKey={xKey} tick={{ fill: "#ffffff", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#ffffff", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="convs" name="convs" stroke="#C026D3" strokeWidth={2} fill="url(#convGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Tokens utilizados por {rango === "hoy" ? "hora" : "día"}</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b1b1b" />
                <XAxis dataKey={xKey} tick={{ fill: "#ffffff", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#ffffff", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tokens" name="tokens" stroke="#f59e0b" strokeWidth={2} fill="url(#tokenGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts row 2: costo + temas */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Costo estimado por {rango === "hoy" ? "hora" : "día"} (USD)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b1b1b" />
                <XAxis dataKey={xKey} tick={{ fill: "#ffffff", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#ffffff", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="costo" name="costo" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Temas más consultados</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={TOPICS_DATA} layout="vertical">
                <XAxis type="number" tick={{ fill: "#ffffff", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="topic" tick={{ fill: "#ffffff", fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="count" name="consultas" fill="#C026D3" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detail table */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-navy-500">
            <p className="text-sm font-semibold text-white">Detalle por {rango === "hoy" ? "hora" : "día"}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-navy-500">
                <tr>
                  {[rango === "hoy" ? "Hora" : "Fecha", "Conversaciones", "Respuestas de Emma", "Tokens usados", "Costo estimado"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-white/40 font-semibold text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((d: any) => (
                  <tr key={d[xKey]} className="border-b border-navy-500 last:border-0 hover:bg-navy-700/30 transition">
                    <td className="px-5 py-3 text-white font-semibold">{d[xKey]}</td>
                    <td className="px-5 py-3 text-cls-primary font-semibold">{d.convs}</td>
                    <td className="px-5 py-3 text-blue-300">{d.respuestas || "—"}</td>
                    <td className="px-5 py-3 text-amber-300 font-mono">{d.tokens?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-green-400 font-mono">${d.costo?.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-navy-500">
                <tr>
                  <td className="px-5 py-3 text-white/40 text-xs font-semibold uppercase">Total</td>
                  <td className="px-5 py-3 text-cls-primary font-bold">{totals.convs}</td>
                  <td className="px-5 py-3 text-blue-300 font-bold">{totals.respuestas || "—"}</td>
                  <td className="px-5 py-3 text-amber-300 font-bold font-mono">{totals.tokens?.toLocaleString()}</td>
                  <td className="px-5 py-3 text-green-400 font-bold font-mono">${totals.costo?.toFixed(4)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  const colors: Record<string, string> = {
    cls: "text-cls-primary border-fuchsia-900/40",
    blue: "text-blue-300 border-blue-900/40",
    green: "text-green-400 border-green-900/40",
    purple: "text-purple-400 border-purple-900/40",
    amber: "text-amber-400 border-amber-900/40",
    emerald: "text-emerald-400 border-emerald-900/40",
  };
  return (
    <div className={`rounded-2xl border bg-navy-700 p-4 flex flex-col gap-2 ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wide leading-tight">{label}</p>
        <span className="text-base">{icon}</span>
      </div>
      <p className={`text-2xl font-black tracking-tight ${colors[color].split(" ")[0]}`}>{value}</p>
    </div>
  );
}
