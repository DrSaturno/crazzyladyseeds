import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Channel, CHANNEL_LABEL, CHANNEL_ICON } from "./Dashboard";

interface Contacto {
  id: number; nombre: string; telefono: string; channel: Channel;
  interes: string; perfil: string; etapa: string; etapaColor: string;
  etiquetas: string[]; ultimaActividad: string; notas: string;
}

const CONTACTOS_INIT: Contacto[] = [
  { id: 1, nombre: "Valentina Gómez", telefono: "+54 9 11 4523-1234", channel: "whatsapp", interes: "Automáticas THC", perfil: "Interior", etapa: "Consulta", etapaColor: "#3b82f6", etiquetas: ["nueva", "interior"], ultimaActividad: "hace 2 min", notas: "Preguntó por automáticas THC, todavía no eligió genética." },
  { id: 2, nombre: "Lucas Fernández", telefono: "@lucasf_grow", channel: "instagram", interes: "Amnesia (Sensi Seeds)", perfil: "Exterior", etapa: "Asesorado", etapaColor: "#f59e0b", etiquetas: ["con-experiencia"], ultimaActividad: "hace 8 min", notas: "Ya cultivó antes, le interesa la Amnesia fotoperiódica." },
  { id: 3, nombre: "Tomás Rodríguez", telefono: "@tomasrod", channel: "telegram", interes: "Esquejes registrados", perfil: "—", etapa: "Asesorado", etapaColor: "#f59e0b", etiquetas: ["esquejes"], ultimaActividad: "hace 23 min", notas: "Preguntó si los esquejes son variedades registradas." },
  { id: 4, nombre: "Sofía Martínez", telefono: "sesión web #8841", channel: "web", interes: "White Widow x3", perfil: "Principiante", etapa: "Consulta", etapaColor: "#3b82f6", etiquetas: ["envio", "bariloche"], ultimaActividad: "hace 15 min", notas: "Preguntó costo de envío a Bariloche, esperando CP." },
  { id: 5, nombre: "Camila López", telefono: "+54 9 11 5678-9012", channel: "whatsapp", interes: "REPROCANN", perfil: "—", etapa: "Derivado", etapaColor: "#8b5cf6", etiquetas: ["reprocann"], ultimaActividad: "hace 41 min", notas: "Derivada a @clinicann para el trámite de REPROCANN." },
  { id: 6, nombre: "Mateo García", telefono: "@mategrower", channel: "instagram", interes: "Gorila Glue Auto x2", perfil: "Interior", etapa: "Comprado", etapaColor: "#10b981", etiquetas: ["cierre-venta"], ultimaActividad: "hace 1 hs", notas: "Pedido armado y derivado a una persona para cerrar." },
  { id: 7, nombre: "Florencia Díaz", telefono: "sesión web #8756", channel: "web", interes: "INASE / legalidad", perfil: "—", etapa: "Asesorado", etapaColor: "#f59e0b", etiquetas: ["legalidad"], ultimaActividad: "hace 2 hs", notas: "Consultó legalidad, se le pasó el guion fijo de INASE." },
  { id: 8, nombre: "Agustín Pérez", telefono: "+54 9 11 9012-3456", channel: "whatsapp", interes: "AK47 Auto (recomendada)", perfil: "Interior, placard chico", etapa: "Asesorado", etapaColor: "#f59e0b", etiquetas: ["principiante"], ultimaActividad: "hace 3 hs", notas: "Primer cultivo. Se le recomendó AK47 Auto x4." },
  { id: 9, nombre: "Carolina Ríos", telefono: "@caro.cultiva", channel: "instagram", interes: "CBD", perfil: "—", etapa: "Consulta", etapaColor: "#3b82f6", etiquetas: ["cbd"], ultimaActividad: "hace 4 hs", notas: "Preguntó precios de línea CBD." },
  { id: 10, nombre: "Ignacio Herrera", telefono: "@ignacioh", channel: "telegram", interes: "Purple Punch (sin stock)", perfil: "—", etapa: "Consulta", etapaColor: "#3b82f6", etiquetas: ["esperando-stock"], ultimaActividad: "hace 5 hs", notas: "Pidió que le avisen cuando vuelva el stock." },
];

const ETAPAS = ["Consulta", "Asesorado", "Derivado", "Comprado"];
const ETAPA_COLORS: Record<string, string> = {
  "Consulta": "#3b82f6", "Asesorado": "#f59e0b", "Derivado": "#8b5cf6", "Comprado": "#10b981",
};
const EMPTY_FORM = { nombre: "", telefono: "", channel: "whatsapp" as Channel, etapa: "Consulta", notas: "", etiquetas: "" };
const inp = "w-full bg-navy-800 border border-navy-500 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cls-primary placeholder-white/30";

export default function CRM() {
  const [contactos, setContactos] = useState<Contacto[]>(CONTACTOS_INIT);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Contacto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const navigate = useNavigate();

  const filtered = search.trim()
    ? contactos.filter((c) =>
        c.nombre.toLowerCase().includes(search.toLowerCase()) ||
        c.etapa.toLowerCase().includes(search.toLowerCase()) ||
        c.interes.toLowerCase().includes(search.toLowerCase())
      )
    : contactos;

  function handleSave() {
    if (!form.nombre.trim()) return;
    const color = ETAPA_COLORS[form.etapa] || "#3b82f6";
    const nuevo: Contacto = {
      id: Date.now(), nombre: form.nombre, telefono: form.telefono, channel: form.channel,
      interes: "Por definir", perfil: "—", etapa: form.etapa,
      etapaColor: color, etiquetas: form.etiquetas.split(",").map((e) => e.trim()).filter(Boolean),
      ultimaActividad: "ahora", notas: form.notas,
    };
    setContactos((prev) => [nuevo, ...prev]);
    setShowModal(false);
    setForm(EMPTY_FORM);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-navy-500 bg-navy-900 px-4 md:px-6 py-3 md:py-4 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white">CRM</h1>
          <p className="text-xs text-white/50 mt-0.5 hidden sm:block">{contactos.length} contactos · Crazy Lady Seeds</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setShowModal(true); }} className="px-3 md:px-4 py-2 rounded-lg bg-cls-primary hover:bg-cls-primary-dark text-white text-xs font-bold transition whitespace-nowrap">
          + Nuevo
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto p-3 md:p-6 bg-navy-800">
          <div className="mb-3 md:mb-4">
            <input
              className="w-full max-w-sm bg-navy-700 border border-navy-500 text-white rounded-lg px-4 py-2 text-sm placeholder-white/30 focus:outline-none focus:border-cls-primary"
              placeholder="Buscar por nombre, etapa o interés..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Mobile: cards, Desktop: table */}
          <div className="md:hidden space-y-2">
            {filtered.map((c) => (
              <button key={c.id} onClick={() => setSelected(c)}
                className="w-full text-left card p-4 flex items-start gap-3 hover:border-slate-500 transition">
                <div className="w-10 h-10 rounded-full bg-navy-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">{c.nombre[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-white">{c.nombre}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.etapaColor + "33", border: `1px solid ${c.etapaColor}66`, color: c.etapaColor }}>{c.etapa}</span>
                  </div>
                  <p className="text-[11px] text-white/70 mt-0.5">{c.interes}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-navy-600 text-white/60">{CHANNEL_ICON[c.channel]} {CHANNEL_LABEL[c.channel]}</span>
                    <span className="text-[10px] text-white/40">{c.ultimaActividad}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="hidden md:block card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-navy-500">
                <tr>
                  {["Contacto", "Canal", "Interés", "Etapa", "Última actividad", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-navy-500 last:border-0 hover:bg-navy-600/40 transition cursor-pointer" onClick={() => setSelected(c)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy-500 flex items-center justify-center text-xs font-bold text-white">{c.nombre[0]}</div>
                        <div>
                          <p className="text-white font-semibold">{c.nombre}</p>
                          <p className="text-[11px] text-white/70">{c.telefono}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-navy-600 text-white/70">{CHANNEL_ICON[c.channel]} {CHANNEL_LABEL[c.channel]}</span>
                    </td>
                    <td className="px-4 py-3 text-white/80 text-xs">{c.interes}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: c.etapaColor + "33", border: `1px solid ${c.etapaColor}66`, color: c.etapaColor }}>{c.etapa}</span>
                    </td>
                    <td className="px-4 py-3 text-white text-xs">{c.ultimaActividad}</td>
                    <td className="px-4 py-3">
                      <button onClick={(e) => { e.stopPropagation(); setSelected(c); }} className="text-xs text-cls-primary hover:text-white transition">Ver →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <>
            {/* Mobile overlay */}
            <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSelected(null)} />
            <aside className={`
              fixed bottom-0 left-0 right-0 z-40 max-h-[80vh] overflow-y-auto rounded-t-2xl
              md:static md:max-h-none md:rounded-none md:z-auto
              w-full md:w-72 flex-shrink-0 border-t md:border-t-0 md:border-l border-navy-500 bg-navy-900 flex flex-col
            `}>
              <div className="px-5 py-4 border-b border-navy-500 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Perfil del contacto</p>
                <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white text-lg leading-none">×</button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-cls-primary/20 text-cls-primary flex items-center justify-center text-lg font-bold">{selected.nombre[0]}</div>
                  <div>
                    <p className="text-white font-bold">{selected.nombre}</p>
                    <p className="text-xs text-white/60">{selected.telefono}</p>
                  </div>
                </div>
                <Field label="Canal de origen">{CHANNEL_ICON[selected.channel]} {CHANNEL_LABEL[selected.channel]}</Field>
                <Field label="Interés">{selected.interes}</Field>
                <Field label="Perfil de cultivo">{selected.perfil}</Field>
                <Field label="Etapa">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: selected.etapaColor + "33", border: `1px solid ${selected.etapaColor}66`, color: selected.etapaColor }}>{selected.etapa}</span>
                </Field>
                <Field label="Etiquetas">
                  <div className="flex flex-wrap gap-1 mt-1">{selected.etiquetas.map((t) => <span key={t} className="text-[10px] bg-navy-700 text-white/50 px-2 py-0.5 rounded-full">#{t}</span>)}</div>
                </Field>
                <Field label="Notas">{selected.notas || "Sin notas"}</Field>
                <Field label="Última actividad">{selected.ultimaActividad}</Field>
                <button onClick={() => navigate("/admin/conversaciones")} className="w-full py-2 bg-cls-primary hover:bg-cls-primary-dark text-white text-xs font-bold rounded-lg transition">
                  Abrir conversación →
                </button>
              </div>
            </aside>
          </>
        )}
      </div>

      {/* Modal Nuevo Contacto */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <div className="bg-navy-900 border border-navy-500 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white">Nuevo contacto</h2>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Nombre completo *</label>
                  <input className={inp} placeholder="Ej: Juan García" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Teléfono / usuario</label>
                    <input className={inp} placeholder="+54 9 11 XXXX o @usuario" value={form.telefono} onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Canal</label>
                    <select className={inp} value={form.channel} onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value as Channel }))}>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="instagram">Instagram</option>
                      <option value="telegram">Telegram</option>
                      <option value="web">Widget web</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Etapa</label>
                  <select className={inp} value={form.etapa} onChange={(e) => setForm((f) => ({ ...f, etapa: e.target.value }))}>{ETAPAS.map((e) => <option key={e}>{e}</option>)}</select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Etiquetas (separadas por coma)</label>
                  <input className={inp} placeholder="interior, principiante, reprocann" value={form.etiquetas} onChange={(e) => setForm((f) => ({ ...f, etiquetas: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Notas</label>
                  <textarea className={`${inp} resize-none`} rows={3} placeholder="Observaciones..." value={form.notas} onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-navy-500 text-white/60 hover:text-white text-sm font-semibold transition">Cancelar</button>
                <button onClick={handleSave} disabled={!form.nombre.trim()} className="flex-[2] py-2.5 rounded-xl bg-cls-primary hover:bg-cls-primary-dark disabled:opacity-30 text-white text-sm font-bold transition">Crear contacto</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">{label}</p>
      <div className="text-sm text-white">{children}</div>
    </div>
  );
}
