import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { to: "/admin/conversaciones", label: "Conversaciones", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
  { to: "/admin/crm", label: "CRM", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { to: "/admin/pipeline", label: "Pipeline", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg> },
  { to: "/admin/productos", label: "Productos", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { to: "/admin/automatizaciones", label: "Automatizaciones", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { to: "/admin/broadcast", label: "Broadcast", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg> },
  { to: "/admin/metricas", label: "Métricas", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { to: "/admin/bot", label: "Demo Emma", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2v4M8 11h.01M12 11h.01M16 11h.01M8 14h8" /></svg> },
  { to: "/admin/configuracion", label: "Configuración", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" strokeWidth={1.8} /></svg> },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [botActivo, setBotActivo] = useState(true);

  return (
    <aside className="w-64 flex-shrink-0 bg-navy-900 flex flex-col border-r border-navy-500 h-full">
      {/* Logo — wordmark de texto hasta que suban el PNG del logo a public/ */}
      <Link to="/admin" className="block p-4 border-b border-navy-500 bg-black text-center">
        <p className="text-xl font-black tracking-tight leading-none cls-wordmark">CRAZY LADY</p>
        <p className="text-xs font-bold tracking-[0.3em] text-white/70 mt-0.5">SEEDS</p>
        <p className="text-[9px] font-bold tracking-widest text-white/30 mt-1">PANEL INTERNO</p>
      </Link>

      {/* Salida a la tienda pública */}
      <Link
        to="/"
        className="mx-2 mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-navy-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Ver la tienda
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive ? "bg-cls-primary text-white" : "text-white hover:text-white hover:bg-navy-700"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bot toggle button */}
      <div className="px-3 py-3 border-t border-navy-500">
        <button
          onClick={() => setBotActivo((v) => !v)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all font-semibold text-xs ${
            botActivo
              ? "bg-green-900/30 border-green-700 text-green-400 hover:bg-green-900/50"
              : "bg-red-900/20 border-red-900 text-red-400 hover:bg-red-900/30"
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
          </svg>
          <div className="flex-1 text-left">
            <p className="leading-tight">{botActivo ? "Emma activa" : "Emma apagada"}</p>
            <p className="text-[10px] opacity-60 font-normal">{botActivo ? "Click para apagar" : "Click para activar"}</p>
          </div>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${botActivo ? "bg-green-400 animate-pulse" : "bg-red-500"}`} />
        </button>
        <p className="text-[10px] text-white/25 text-center mt-2 flex items-center justify-center gap-1">
          By
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5.5" fill="currentColor" />
            <ellipse cx="12" cy="12" rx="11" ry="3.2" stroke="currentColor" strokeWidth="1.6" transform="rotate(-24 12 12)" />
          </svg>
          DrSaturno
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-navy-500">
        <p className="text-[10px] text-white/30 text-center">Crazy Lady Seeds · Panel Emma</p>
      </div>
    </aside>
  );
}
