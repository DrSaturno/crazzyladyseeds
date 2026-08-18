import { useState } from "react";
import { type Channel, CHANNEL_ICON } from "./Dashboard";

interface Lead { id: number; nombre: string; interes: string; telefono: string; tiempo: string; channel: Channel; }
interface Etapa { id: string; nombre: string; color: string; leads: Lead[]; }

const PIPELINE_INICIAL: Etapa[] = [
  {
    id: "consulta", nombre: "Consulta", color: "#3b82f6",
    leads: [
      { id: 1, nombre: "Valentina Gómez", interes: "Automáticas THC", telefono: "+54 9 11 4523-1234", tiempo: "hace 2 min", channel: "whatsapp" },
      { id: 4, nombre: "Sofía Martínez", interes: "White Widow x3", telefono: "sesión web #8841", tiempo: "hace 15 min", channel: "web" },
      { id: 9, nombre: "Carolina Ríos", interes: "CBD", telefono: "@caro.cultiva", tiempo: "hace 4 hs", channel: "instagram" },
      { id: 10, nombre: "Ignacio Herrera", interes: "Purple Punch (sin stock)", telefono: "@ignacioh", tiempo: "hace 5 hs", channel: "telegram" },
    ],
  },
  {
    id: "asesorado", nombre: "Asesorado", color: "#f59e0b",
    leads: [
      { id: 2, nombre: "Lucas Fernández", interes: "Amnesia (Sensi Seeds)", telefono: "@lucasf_grow", tiempo: "hace 8 min", channel: "instagram" },
      { id: 3, nombre: "Tomás Rodríguez", interes: "Esquejes registrados", telefono: "@tomasrod", tiempo: "hace 23 min", channel: "telegram" },
      { id: 7, nombre: "Florencia Díaz", interes: "INASE / legalidad", telefono: "sesión web #8756", tiempo: "hace 2 hs", channel: "web" },
      { id: 8, nombre: "Agustín Pérez", interes: "AK47 Auto (recomendada)", telefono: "+54 9 11 9012-3456", tiempo: "hace 3 hs", channel: "whatsapp" },
    ],
  },
  {
    id: "derivado", nombre: "Derivado a persona", color: "#8b5cf6",
    leads: [
      { id: 5, nombre: "Camila López", interes: "REPROCANN → @clinicann", telefono: "+54 9 11 5678-9012", tiempo: "hace 41 min", channel: "whatsapp" },
    ],
  },
  {
    id: "comprado", nombre: "Comprado", color: "#10b981",
    leads: [
      { id: 6, nombre: "Mateo García", interes: "Gorila Glue Auto x2", telefono: "@mategrower", tiempo: "hace 1 hs", channel: "instagram" },
    ],
  },
];

export default function Pipeline() {
  const [etapas, setEtapas] = useState(PIPELINE_INICIAL);
  const [dragging, setDragging] = useState<{ lead: Lead; fromEtapa: string } | null>(null);
  const totalLeads = etapas.reduce((a, e) => a + e.leads.length, 0);
  const comprados = etapas.find(e => e.id === "comprado")?.leads.length ?? 0;
  const conversion = Math.round((comprados / totalLeads) * 100);

  function handleDrop(toEtapaId: string) {
    if (!dragging || dragging.fromEtapa === toEtapaId) { setDragging(null); return; }
    setEtapas((prev) =>
      prev.map((e) => {
        if (e.id === dragging.fromEtapa) return { ...e, leads: e.leads.filter((l) => l.id !== dragging.lead.id) };
        if (e.id === toEtapaId) return { ...e, leads: [...e.leads, dragging.lead] };
        return e;
      })
    );
    setDragging(null);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-navy-500 bg-navy-900 px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white">Pipeline comercial</h1>
            <p className="text-xs text-white/50 mt-0.5 hidden sm:block">Arrastrá las tarjetas · consulta → asesorado → derivado → comprado</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xl font-black text-white">{totalLeads} leads</p>
              <p className="text-[10px] text-green-400 font-semibold">{conversion}% conversión</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex-shrink-0 bg-navy-900 border-b border-navy-500 px-4 md:px-6 py-2 flex gap-3 md:gap-4 overflow-x-auto">
        {etapas.map((e) => (
          <div key={e.id} className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
            <span className="text-xs text-white/60 hidden sm:block">{e.nombre}</span>
            <span className="text-xs font-bold text-white bg-navy-700 px-2 py-0.5 rounded-full">{e.leads.length}</span>
          </div>
        ))}
        <div className="ml-auto flex-shrink-0 flex items-center gap-1.5 sm:hidden">
          <span className="text-xs font-bold text-white">{totalLeads} leads</span>
          <span className="text-xs text-green-400 font-semibold">· {conversion}% conv.</span>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-3 md:p-4 bg-navy-800">
        <div className="flex gap-3 h-full" style={{ minWidth: `${etapas.length * 200}px` }}>
          {etapas.map((etapa) => (
            <div
              key={etapa.id}
              className="flex-1 min-w-[185px] flex flex-col bg-navy-900 rounded-xl border border-navy-500 overflow-hidden"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(etapa.id)}
            >
              <div className="px-3 py-3 flex items-center gap-2 border-b-2" style={{ borderBottomColor: etapa.color + "60" }}>
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: etapa.color }} />
                <p className="text-xs font-bold text-white flex-1 leading-tight">{etapa.nombre}</p>
                <span className="text-xs font-black text-white bg-navy-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">{etapa.leads.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {etapa.leads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragging({ lead, fromEtapa: etapa.id })}
                    onDragEnd={() => setDragging(null)}
                    className="bg-navy-700 border border-navy-500 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-slate-400 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: etapa.color + "40", border: `1.5px solid ${etapa.color}60` }}>
                        {lead.nombre[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate leading-tight">{lead.nombre}</p>
                        <p className="text-[10px] text-white/50 truncate">{lead.telefono}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-navy-600 text-white/60 truncate max-w-[130px]">{lead.interes}</span>
                      <span className="text-[10px] text-white/40 flex-shrink-0">{CHANNEL_ICON[lead.channel]}</span>
                    </div>
                    <p className="text-[10px] text-white/30">⏱ {lead.tiempo}</p>
                  </div>
                ))}
                {etapa.leads.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 opacity-30">
                    <p className="text-2xl mb-1">○</p>
                    <p className="text-[10px] text-white">Sin leads</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
