import { useState } from "react";

interface Auto { id: number; nombre: string; tipo: string; icono: string; trigger: string; mensaje: string; activa: boolean; ejecuciones: number; tasa: string; }

// Ciclo de cultivo real, sacado de docs/bot.md § Automatizaciones (bot_automations) — fase 2, después del lanzamiento.
const INIT: Auto[] = [
  { id: 1, nombre: "Bienvenida al primer mensaje", tipo: "Bienvenida", icono: "👋", trigger: "Primer mensaje del contacto", mensaje: "Hola! soy Emma, la guardiana digital del jardín de Crazy Lady Seeds! Contame, en qué puedo ayudarte?", activa: true, ejecuciones: 96, tasa: "100%" },
  { id: 2, nombre: "Germinación (+3 días de compra)", tipo: "Ciclo de cultivo", icono: "🌱", trigger: "Compra +3 días", mensaje: "Hola {nombre}! Cómo va la germinación? Cualquier duda con las primeras raíces, contame 🌱", activa: true, ejecuciones: 22, tasa: "91%" },
  { id: 3, nombre: "Vegetativo (+15 días de compra)", tipo: "Ciclo de cultivo", icono: "🪴", trigger: "Compra +15 días", mensaje: "Hola {nombre}! Ya deberías estar en vegetativo — ¿cómo vas de luz, riego y sustrato?", activa: true, ejecuciones: 19, tasa: "87%" },
  { id: 4, nombre: "Floración (+45 días de compra)", tipo: "Ciclo de cultivo", icono: "🌸", trigger: "Compra +45 días", mensaje: "Hola {nombre}! Etapa de floración: te dejo unas notas sobre fertilizante y plagas por si te sirve.", activa: true, ejecuciones: 14, tasa: "82%" },
  { id: 5, nombre: "Cosecha (+90 días de compra)", tipo: "Ciclo de cultivo", icono: "✂️", trigger: "Compra +90 días", mensaje: "Hola {nombre}! Ya casi es hora de cosechar — cualquier duda de secado y curado, contame.", activa: true, ejecuciones: 9, tasa: "78%" },
  { id: 6, nombre: "Reseña y recompra (+105 días de compra)", tipo: "Post-conversión", icono: "⭐", trigger: "Compra +105 días", mensaje: "Hola {nombre}! Cómo te fue con la genética que llevaste? Nos encantaría tu reseña — y si querés repetir, contame.", activa: true, ejecuciones: 6, tasa: "68%" },
  { id: 7, nombre: "Re-engage — consultó y no compró (+7 días)", tipo: "Re-enganche", icono: "🔄", trigger: "Consultó y no compró +7 días", mensaje: "Hola {nombre}! Seguís con ganas de arrancar el cultivo? Contame si tenés dudas, sigo por acá.", activa: true, ejecuciones: 31, tasa: "64%" },
  { id: 8, nombre: "Carrito abandonado (+2 hs)", tipo: "Re-enganche", icono: "🛒", trigger: "Carrito abandonado +2 hs", mensaje: "Hola {nombre}! Vi que dejaste algo en el carrito — te lo guardo, avisame si te surgió alguna duda.", activa: false, ejecuciones: 4, tasa: "50%" },
];

const ULTIMAS_EJECUCIONES = [
  { id: 1, contacto: "Valentina Gómez", automatizacion: "Bienvenida al primer mensaje", hora: "hace 2 min", estado: "enviado" },
  { id: 2, contacto: "Agustín Pérez", automatizacion: "Germinación (+3 días)", hora: "hace 45 min", estado: "enviado" },
  { id: 3, contacto: "Mateo García", automatizacion: "Bienvenida al primer mensaje", hora: "hace 1 hs", estado: "enviado" },
  { id: 4, contacto: "Ignacio Herrera", automatizacion: "Re-engage — consultó y no compró", hora: "hace 3 hs", estado: "fallido" },
  { id: 5, contacto: "Sofía Martínez", automatizacion: "Carrito abandonado", hora: "hace 5 hs", estado: "enviado" },
  { id: 6, contacto: "Camila López", automatizacion: "Bienvenida al primer mensaje", hora: "hace 6 hs", estado: "enviado" },
];

const TRIGGERS = ["Primer mensaje del contacto", "Compra +3 días", "Compra +15 días", "Compra +45 días", "Compra +90 días", "Compra +105 días", "Consultó y no compró +7 días", "Carrito abandonado +2 hs", "Personalizado"];
const TIPOS = ["Bienvenida", "Ciclo de cultivo", "Re-enganche", "Post-conversión", "Personalizado"];
const ICONOS = ["👋", "🌱", "🪴", "🌸", "✂️", "⭐", "🔄", "🛒"];
const EMPTY_FORM = { nombre: "", tipo: "Bienvenida", icono: "👋", trigger: "Primer mensaje del contacto", mensaje: "" };
const inp = "w-full bg-navy-800 border border-navy-500 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cls-primary placeholder-white/30";

export default function Automatizaciones() {
  const [autos, setAutos] = useState(INIT);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function toggle(id: number) { setAutos((prev) => prev.map((a) => a.id === id ? { ...a, activa: !a.activa } : a)); }
  function handleSave() {
    if (!form.nombre.trim() || !form.mensaje.trim()) return;
    setAutos((prev) => [...prev, { id: Date.now(), ...form, activa: true, ejecuciones: 0, tasa: "—" }]);
    setShowModal(false);
    setForm(EMPTY_FORM);
  }

  const activas = autos.filter((a) => a.activa).length;
  const totalEjecuciones = autos.reduce((s, a) => s + a.ejecuciones, 0);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="border-b border-navy-500 bg-navy-900 px-4 md:px-6 py-3 md:py-4 flex-shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white">Automatizaciones</h1>
            <p className="text-xs text-white/50 mt-0.5 hidden sm:block">Ciclo de cultivo, bienvenida y re-enganche — fase 2, después del lanzamiento</p>
          </div>
          <button onClick={() => { setForm(EMPTY_FORM); setShowModal(true); }} className="px-3 md:px-4 py-2 rounded-lg bg-cls-primary hover:bg-cls-primary-dark text-white text-xs font-bold transition whitespace-nowrap">
            + Nueva
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-navy-800 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-3 md:p-4 flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-green-900/30 border border-green-800 flex items-center justify-center text-green-400 text-base md:text-lg">⚡</div>
              <div>
                <p className="text-xl md:text-2xl font-black text-white">{activas}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Activas</p>
              </div>
            </div>
            <div className="card p-3 md:p-4 flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-navy-600 border border-navy-500 flex items-center justify-center text-white/40 text-base md:text-lg">○</div>
              <div>
                <p className="text-xl md:text-2xl font-black text-white">{autos.length - activas}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Inactivas</p>
              </div>
            </div>
            <div className="card p-3 md:p-4 flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-cls-primary/20 border border-cls-primary/40 flex items-center justify-center text-cls-primary text-base md:text-lg">↗</div>
              <div>
                <p className="text-xl md:text-2xl font-black text-white">{totalEjecuciones}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Enviados</p>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-white/40 mb-3">Plantillas configuradas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {autos.map((a) => (
                <div key={a.id} className={`card p-4 transition-all ${!a.activa ? "opacity-50" : ""}`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl flex-shrink-0">{a.icono}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{a.nombre}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-white/40 bg-navy-600 px-2 py-0.5 rounded-full">{a.tipo}</span>
                          <span className="text-[10px] text-white/40">{a.ejecuciones} env. · {a.tasa}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(a.id)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${a.activa ? "bg-cls-primary" : "bg-navy-500"}`}
                    >
                      <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform" style={{ transform: a.activa ? "translateX(18px)" : "translateX(2px)" }} />
                    </button>
                  </div>
                  <p className="text-xs text-white/50 italic line-clamp-2 mb-2">"{a.mensaje.slice(0, 90)}…"</p>
                  <div className="flex items-center justify-between pt-2 border-t border-navy-500">
                    <p className="text-[10px] text-white/30 truncate flex-1">🔔 {a.trigger}</p>
                    <span className={`text-[10px] font-semibold flex-shrink-0 ml-2 ${a.activa ? "text-green-400" : "text-white/30"}`}>
                      {a.activa ? "● Activa" : "○ Inactiva"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Log */}
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-white/40 mb-3">Últimas ejecuciones</h2>
            <div className="card overflow-hidden">
              <div className="divide-y divide-navy-500">
                {ULTIMAS_EJECUCIONES.map((e) => (
                  <div key={e.id} className="px-4 py-2.5 text-xs flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${e.estado === "enviado" ? "bg-green-400" : "bg-red-400"}`} />
                    <span className="text-white/40 flex-shrink-0 hidden sm:block w-24">{e.hora}</span>
                    <span className="text-white truncate flex-1">{e.contacto} <span className="text-white/30">·</span> {e.automatizacion}</span>
                    <span className="text-white/40 sm:hidden flex-shrink-0">{e.hora}</span>
                    <span className={`text-[10px] font-semibold flex-shrink-0 ${e.estado === "enviado" ? "text-green-400" : "text-red-400"}`}>{e.estado}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <div className="bg-navy-900 border border-navy-500 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white">Nueva automatización</h2>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white text-xl">×</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Ícono</label>
                  <div className="flex gap-2 flex-wrap">
                    {ICONOS.map((ic) => (
                      <button key={ic} onClick={() => setForm((f) => ({ ...f, icono: ic }))}
                        className={`text-xl w-10 h-10 rounded-xl border flex items-center justify-center transition ${form.icono === ic ? "border-cls-primary bg-cls-primary/20" : "border-navy-500 hover:border-slate-400"}`}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Nombre *</label>
                  <input className={inp} placeholder="Ej: Bienvenida nuevo lead" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Tipo</label>
                    <select className={inp} value={form.tipo} onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}>{TIPOS.map((t) => <option key={t}>{t}</option>)}</select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Disparador</label>
                    <select className={inp} value={form.trigger} onChange={(e) => setForm((f) => ({ ...f, trigger: e.target.value }))}>{TRIGGERS.map((t) => <option key={t}>{t}</option>)}</select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Mensaje *</label>
                  <p className="text-[10px] text-white/30 mb-2">Variables: {"{nombre}"} {"{fecha}"}</p>
                  <textarea className={`${inp} resize-none`} rows={4} placeholder="Hola {nombre}, te escribimos desde Crazy Lady Seeds..." value={form.mensaje} onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))} />
                  <p className="text-[10px] text-white/30 mt-1 text-right">{form.mensaje.length} / 4096</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-navy-500 text-white/60 hover:text-white text-sm font-semibold transition">Cancelar</button>
                <button onClick={handleSave} disabled={!form.nombre.trim() || !form.mensaje.trim()} className="flex-[2] py-2.5 rounded-xl bg-cls-primary hover:bg-cls-primary-dark disabled:opacity-30 text-white text-sm font-bold transition">
                  Crear automatización
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
