import { useState } from "react";

const SEGMENTOS = [
  { id: "todos", label: "Todos los contactos", count: 86, color: "#e2e8f0", icon: "👥" },
  { id: "automaticas", label: "Interesados en automáticas", count: 34, color: "#3b82f6", icon: "🌱" },
  { id: "esquejes", label: "Interesados en esquejes", count: 12, color: "#8b5cf6", icon: "🌿" },
  { id: "reprocann", label: "Con REPROCANN en trámite", count: 9, color: "#f59e0b", icon: "📋" },
  { id: "compradores", label: "Compradores 2026", count: 21, color: "#10b981", icon: "🎉" },
];

const HISTORIAL = [
  { id: 1, fecha: "10/08/2026", segmento: "Compradores 2026", destinatarios: 21, enviados: 20, tasa: "95.2%", mensaje: "Llegó stock nuevo de fotoperiódicas — te va a interesar si ya cosechaste..." },
  { id: 2, fecha: "28/07/2026", segmento: "Todos los contactos", destinatarios: 79, enviados: 71, tasa: "89.9%", mensaje: "Se viene la Expo de octubre! Contale a tus amigos cultivadores..." },
  { id: 3, fecha: "15/07/2026", segmento: "Interesados en automáticas", destinatarios: 31, enviados: 29, tasa: "93.5%", mensaje: "Nuevo lote de AK47 Auto en stock, $21.000 la x4..." },
];

type Step = "compose" | "confirm" | "done";

export default function Broadcast() {
  const [segmento, setSegmento] = useState("todos");
  const [mensaje, setMensaje] = useState("");
  const [step, setStep] = useState<Step>("compose");
  const [tab, setTab] = useState<"nuevo" | "historial">("nuevo");

  const seg = SEGMENTOS.find((s) => s.id === segmento)!;
  const enviados = Math.round(seg.count * 0.93);
  const fallidos = seg.count - enviados;

  function reset() { setStep("compose"); setMensaje(""); setSegmento("todos"); }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-navy-500 bg-navy-900 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Broadcast</h1>
            <p className="text-xs text-white/50 mt-0.5">Enviá un mensaje masivo a contactos segmentados por WhatsApp</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-semibold">WhatsApp conectado</span>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {(["nuevo", "historial"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition capitalize ${tab === t ? "bg-cls-primary text-white" : "text-white/40 hover:text-white hover:bg-navy-700"}`}>
              {t === "nuevo" ? "Nuevo envío" : "Historial"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-navy-800">
        {/* ── HISTORIAL ── */}
        {tab === "historial" && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-2">
              <div className="card p-4">
                <p className="text-2xl font-black text-white">{HISTORIAL.length}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Envíos totales</p>
              </div>
              <div className="card p-4">
                <p className="text-2xl font-black text-white">{HISTORIAL.reduce((s, h) => s + h.enviados, 0)}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Mensajes entregados</p>
              </div>
              <div className="card p-4">
                <p className="text-2xl font-black text-green-400">92.9%</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Tasa promedio</p>
              </div>
            </div>
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-navy-500">
                <p className="text-sm font-semibold text-white">Envíos anteriores</p>
              </div>
              <div className="divide-y divide-navy-500">
                {HISTORIAL.map((h) => (
                  <div key={h.id} className="px-5 py-4 flex items-start gap-4 hover:bg-navy-700/40 transition">
                    <div className="w-10 h-10 rounded-xl bg-navy-600 border border-navy-500 flex items-center justify-center text-xl flex-shrink-0">📣</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{h.segmento}</span>
                        <span className="text-[10px] text-white/30">·</span>
                        <span className="text-[10px] text-white/40">{h.fecha}</span>
                      </div>
                      <p className="text-xs text-white/50 truncate mb-2">"{h.mensaje}"</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-white/50">{h.destinatarios} destinatarios</span>
                        <span className="text-[11px] text-green-400 font-semibold">✓ {h.enviados} enviados</span>
                        <span className="text-[11px] text-white font-bold bg-green-900/30 border border-green-800 px-2 py-0.5 rounded-full">{h.tasa}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── NUEVO ENVÍO ── */}
        {tab === "nuevo" && (
          <div className="p-6">
            <div className="max-w-3xl mx-auto space-y-5">

              {/* Done */}
              {step === "done" && (
                <div className="card p-10 text-center space-y-5">
                  <div className="text-6xl">✅</div>
                  <div>
                    <h2 className="text-2xl font-black text-white">¡Envío completado!</h2>
                    <p className="text-white/50 text-sm mt-1">Los mensajes fueron despachados correctamente</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                    <div className="bg-navy-900 rounded-xl p-4 border border-navy-500">
                      <p className="text-2xl font-black text-white">{seg.count}</p>
                      <p className="text-[10px] text-white/40 uppercase">Total</p>
                    </div>
                    <div className="bg-green-900/20 rounded-xl p-4 border border-green-800">
                      <p className="text-2xl font-black text-green-400">{enviados}</p>
                      <p className="text-[10px] text-green-400/60 uppercase">Enviados</p>
                    </div>
                    <div className="bg-red-900/20 rounded-xl p-4 border border-red-900">
                      <p className="text-2xl font-black text-red-400">{fallidos}</p>
                      <p className="text-[10px] text-red-400/60 uppercase">Fallidos</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/30">Los mensajes fallidos ocurren cuando el contacto no tiene la ventana de 24hs abierta.</p>
                  <button onClick={reset} className="px-8 py-3 rounded-xl bg-cls-primary hover:bg-cls-primary-dark text-white font-bold transition">
                    Nuevo broadcast
                  </button>
                </div>
              )}

              {/* Confirm */}
              {step === "confirm" && (
                <div className="card p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚠️</span>
                    <div>
                      <p className="text-base font-bold text-yellow-300">Confirmación final</p>
                      <p className="text-xs text-white/50">Esta acción enviará mensajes reales por WhatsApp</p>
                    </div>
                  </div>
                  <div className="bg-navy-900 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Destinatarios</span>
                      <span className="text-white font-bold">{seg.count} contactos</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Segmento</span>
                      <span className="text-white">{seg.label}</span>
                    </div>
                    <div className="flex items-start justify-between text-sm gap-4">
                      <span className="text-white/50 flex-shrink-0">Mensaje</span>
                      <span className="text-white/80 italic text-right">"{mensaje.slice(0, 100)}{mensaje.length > 100 ? "…" : ""}"</span>
                    </div>
                  </div>
                  <div className="text-xs text-white/30 text-center">Una vez enviado, no se puede cancelar ni revertir.</div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep("compose")} className="flex-1 py-3 rounded-xl border border-navy-500 text-white/60 hover:text-white text-sm font-bold transition">← Editar</button>
                    <button onClick={() => setStep("done")} className="flex-[2] py-3 rounded-xl bg-cls-primary hover:bg-cls-primary-dark text-white text-sm font-bold transition">
                      Enviar ahora →
                    </button>
                  </div>
                </div>
              )}

              {/* Compose */}
              {step === "compose" && (
                <>
                  {/* Segmentos */}
                  <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">1. Elegí el segmento de destinatarios</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {SEGMENTOS.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSegmento(s.id)}
                          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition ${
                            segmento === s.id
                              ? "border-cls-primary bg-cls-primary/10"
                              : "border-navy-500 bg-navy-700 hover:border-slate-500"
                          }`}
                        >
                          <span className="text-2xl">{s.icon}</span>
                          <div>
                            <p className="text-xs font-semibold text-white leading-tight">{s.label}</p>
                            <p className="text-xs font-black mt-0.5" style={{ color: s.color }}>{s.count} contactos</p>
                          </div>
                          {segmento === s.id && (
                            <span className="ml-auto text-cls-primary">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">2. Redactá el mensaje</p>
                    <div className="card p-4">
                      <p className="text-[10px] text-white/30 mb-3">Variables: {"{nombre}"} {"{fecha}"} — Se reemplazarán automáticamente</p>
                      <textarea
                        className="w-full bg-navy-900 border border-navy-500 text-white rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-cls-primary placeholder-white/20"
                        rows={5}
                        placeholder="Hola {nombre}, te escribimos desde Crazy Lady Seeds 🌱..."
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[10px] text-white/30">Formato WhatsApp: *negrita* _cursiva_</p>
                        <p className="text-[10px] text-white/30">{mensaje.length} / 4096</p>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  {mensaje && (
                    <div>
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Preview del mensaje</p>
                      <div className="bg-navy-900 rounded-xl p-4 flex justify-end">
                        <div className="max-w-[70%] bg-cls-primary rounded-2xl rounded-tr-sm px-4 py-3">
                          <p className="text-xs text-white leading-relaxed whitespace-pre-wrap">{mensaje.replace("{nombre}", "Valentina")}</p>
                          <p className="text-[10px] text-fuchsia-200 mt-1 text-right">14:30 ✓✓</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setStep("confirm")}
                    disabled={!mensaje.trim()}
                    className="w-full py-4 rounded-xl bg-cls-primary hover:bg-cls-primary-dark disabled:opacity-30 text-white font-bold transition text-sm"
                  >
                    Revisar y enviar a {seg.count} contactos →
                  </button>
                  <p className="text-[10px] text-white/20 text-center">Solo contactos con ventana de 24hs abierta recibirán el mensaje correctamente.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
