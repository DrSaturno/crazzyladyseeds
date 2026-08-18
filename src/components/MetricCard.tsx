interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  unit?: string;
  icon: React.ReactNode;
  accentColor?: string;
}

export default function MetricCard({ label, value, trend, unit, icon, accentColor = "bg-cls-primary" }: MetricCardProps) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-white/60 uppercase tracking-widest">{label}</p>
        <div className={`w-9 h-9 rounded-lg ${accentColor} bg-opacity-20 flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">
          {value}
          {unit && <span className="text-base font-normal text-white/50 ml-1">{unit}</span>}
        </p>
        {trend !== undefined && (
          <p className={`mt-1 text-xs font-medium ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs ayer
          </p>
        )}
      </div>
    </div>
  );
}
