import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { type Channel, CHANNEL_LABEL, CHANNEL_ICON, CHANNEL_CLASS } from "./Dashboard";

interface Msg { from: "bot" | "user"; text: string; hora: string }
interface Conv {
  id: string; nombre: string; contacto: string; channel: Channel; ultimoMensaje: string;
  hora: string; topic: string; status: "activa" | "resuelta" | "pendiente"; msgs: Msg[];
}

const MOCK: Conv[] = [
  {
    id: "1", nombre: "Valentina Gómez", contacto: "+54 9 11 4523-1234", channel: "whatsapp",
    ultimoMensaje: "¿Tenés stock de automáticas THC?", hora: "hace 2 min",
    topic: "Automáticas", status: "activa",
    msgs: [
      { from: "user", text: "Hola! Hay stock de automáticas?", hora: "14:19" },
      { from: "bot", text: "Hola! soy Emma, la guardiana digital del jardín de Crazy Lady Seeds! Sí, tengo 🌱 ¿la buscás en CBD o en THC?", hora: "14:19" },
      { from: "user", text: "thc", hora: "14:21" },
      { from: "bot", text: "Tengo varias autoflorecientes THC en stock ahora: AK47 Auto x4 ($21.000, Crazy Lady Seeds), Amnesia Haze Auto x4 ($21.000) y Super Skunk Auto x3 de Sensi Seeds ($44.000). ¿Alguna te llama la atención?", hora: "14:21" },
      { from: "user", text: "¿Tenés stock de automáticas THC?", hora: "14:23" },
    ],
  },
  {
    id: "2", nombre: "Lucas Fernández", contacto: "@lucasf_grow", channel: "instagram",
    ultimoMensaje: "Perfecto, gracias por la info de la Amnesia!", hora: "hace 8 min",
    topic: "Fotoperiódicas", status: "resuelta",
    msgs: [
      { from: "user", text: "hola vi la amnesia en una story, todavia tienen?", hora: "13:50" },
      { from: "bot", text: "Hola! Sí, la Amnesia de Sensi Seeds está en stock — $50.000, fotoperiódica, efecto bien cerebral. ¿Es tu primera vez cultivando o ya tenés experiencia?", hora: "13:50" },
      { from: "user", text: "ya cultive un par de veces", hora: "13:52" },
      { from: "bot", text: "Genial, entonces te va a rendir bien. Es de floración algo más larga que las autos, pero el resultado vale la pena. ¿Interior o exterior?", hora: "13:53" },
      { from: "user", text: "Perfecto, gracias por la info de la Amnesia!", hora: "14:01" },
    ],
  },
  {
    id: "3", nombre: "Tomás Rodríguez", contacto: "@tomasrod", channel: "telegram",
    ultimoMensaje: "¿Los esquejes son variedades registradas?", hora: "hace 23 min",
    topic: "Esquejes", status: "resuelta",
    msgs: [
      { from: "user", text: "hacen envio de esquejes?", hora: "13:30" },
      { from: "bot", text: "Hola! Sí, vendemos esquejes — son variedades registradas y también de selección propia de la casa. ¿Buscás alguna genética en particular?", hora: "13:30" },
      { from: "user", text: "¿Los esquejes son variedades registradas?", hora: "13:35" },
      { from: "bot", text: "Sí, las que tenemos como esqueje son registradas INASE o de nuestra propia selección — nunca genética sin origen. Cualquier duda de cuidados en el traslado, contame y te ayudo.", hora: "13:35" },
    ],
  },
  {
    id: "4", nombre: "Sofía Martínez", contacto: "sesión web #8841", channel: "web",
    ultimoMensaje: "¿Cuánto sale el envío a Bariloche?", hora: "hace 15 min",
    topic: "Envíos", status: "activa",
    msgs: [
      { from: "bot", text: "(Sofía está mirando la ficha de White Widow x3 — Buddha Seeds)", hora: "13:44" },
      { from: "user", text: "esta buena esta para principiante?", hora: "13:45" },
      { from: "bot", text: "Sí, es bastante noble para empezar. ¿Cuánto sale el envío a Bariloche?", hora: "13:48" },
      { from: "bot", text: "El costo de envío se calcula por código postal — pasame el tuyo y te lo calculo por Andreani (despacho en 48hs).", hora: "13:48" },
    ],
  },
  {
    id: "5", nombre: "Camila López", contacto: "+54 9 11 5678-9012", channel: "whatsapp",
    ultimoMensaje: "¿Cómo tramito el REPROCANN?", hora: "hace 41 min",
    topic: "REPROCANN", status: "pendiente",
    msgs: [
      { from: "user", text: "che como hago para sacar el reprocann", hora: "13:15" },
      { from: "bot", text: "Eso te lo maneja mejor un gestor especializado — te paso el contacto de @clinicann, que es con quien trabajamos. Yo puedo ayudarte con el resto: genética, cultivo y pedido.", hora: "13:16" },
      { from: "user", text: "¿Cómo tramito el REPROCANN?", hora: "13:17" },
    ],
  },
  {
    id: "6", nombre: "Mateo García", contacto: "@mategrower", channel: "instagram",
    ultimoMensaje: "Gracias, me contacto con el equipo!", hora: "hace 1 hs",
    topic: "Cierre de venta", status: "resuelta",
    msgs: [
      { from: "user", text: "quiero comprar 2 gorila glue auto", hora: "12:40" },
      { from: "bot", text: "Buenísimo! Te dejo el pedido armado (2x Gorila Glue Auto, $21.000 c/u) y te contacta alguien del equipo para coordinar pago y envío.", hora: "12:41" },
      { from: "user", text: "Gracias, me contacto con el equipo!", hora: "13:00" },
    ],
  },
  {
    id: "7", nombre: "Florencia Díaz", contacto: "sesión web #8756", channel: "web",
    ultimoMensaje: "¿Es legal comprar semillas en Argentina?", hora: "hace 2 hs",
    topic: "INASE / legalidad", status: "resuelta",
    msgs: [
      { from: "user", text: "¿Es legal comprar semillas en Argentina?", hora: "11:30" },
      { from: "bot", text: "Somos una empresa que trabaja bajo las normativas de la ley 23750 y 27669 con las licencias de INASE y ARICCAME vigentes para la distribución, comercialización y producción de semillas y esquejes de cannabis medicinal.", hora: "11:30" },
      { from: "user", text: "genial, gracias", hora: "11:32" },
    ],
  },
  {
    id: "8", nombre: "Agustín Pérez", contacto: "+54 9 11 9012-3456", channel: "whatsapp",
    ultimoMensaje: "Nunca cultivé, ¿por dónde arranco?", hora: "hace 3 hs",
    topic: "Recomendación", status: "resuelta",
    msgs: [
      { from: "user", text: "Nunca cultivé, ¿por dónde arranco?", hora: "10:50" },
      { from: "bot", text: "Bienvenido al jardín 🌱 Contame: ¿cuál es tu objetivo de uso?", hora: "10:50" },
      { from: "user", text: "personal, para relajarme", hora: "10:52" },
      { from: "bot", text: "Buenísimo. ¿Qué sustrato pensás usar y con qué espacio/luminarias contás?", hora: "10:53" },
      { from: "user", text: "tierra comun, un placard con un led chico", hora: "10:54" },
      { from: "bot", text: "Con eso te recomiendo una automática, más corta y perdonadora — la AK47 Auto x4 de la casa ($21.000) es un clásico noble para empezar.", hora: "10:55" },
    ],
  },
  {
    id: "9", nombre: "Carolina Ríos", contacto: "@caro.cultiva", channel: "instagram",
    ultimoMensaje: "¿Qué precio tenés en CBD?", hora: "hace 4 hs",
    topic: "CBD", status: "pendiente",
    msgs: [
      { from: "user", text: "¿Qué precio tenés en CBD?", hora: "09:45" },
      { from: "bot", text: "Tengo varias en stock: Royal Highness CBD x3 ($27.000), Royal Medic CBD x3 ($27.000) y Medikit CBD x3 de Buddha Seeds ($41.000). ¿Buscás más THC o más balanceada?", hora: "09:45" },
    ],
  },
  {
    id: "10", nombre: "Ignacio Herrera", contacto: "@ignacioh", channel: "telegram",
    ultimoMensaje: "Quiero saber más sobre la Purple Punch", hora: "hace 5 hs",
    topic: "Consulta de producto", status: "resuelta",
    msgs: [
      { from: "user", text: "Quiero saber más sobre la Purple Punch", hora: "08:30" },
      { from: "bot", text: "La Purple Punch de la casa es automática — está sin stock ahora mismo. ¿Querés que te avise cuando entre, o te tiro otras opciones parecidas en efecto?", hora: "08:30" },
      { from: "user", text: "dale avisame porfa", hora: "08:32" },
    ],
  },
];

const STATUS_CLASS: Record<Conv["status"], string> = {
  activa: "text-green-400 bg-green-900/30 border-green-800",
  resuelta: "text-yellow-400 bg-yellow-900/30 border-yellow-800",
  pendiente: "text-red-400 bg-red-900/30 border-red-800",
};

const ALL_CHANNELS: Channel[] = ["whatsapp", "instagram", "telegram", "web"];

export default function Conversaciones() {
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState<Conv>(MOCK[0]);
  const [showChat, setShowChat] = useState(false); // mobile: show chat panel
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<Channel | "todos">("todos");
  const [msg, setMsg] = useState("");
  const [botPausado, setBotPausado] = useState(false);
  const [showIntervene, setShowIntervene] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const found = MOCK.find((c) => c.id === id);
      if (found) { setSelected(found); setShowChat(true); }
    }
  }, [searchParams]);

  const filtered = MOCK.filter((c) => {
    const matchesChannel = channelFilter === "todos" || c.channel === channelFilter;
    const matchesSearch = !search.trim() ||
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.topic.toLowerCase().includes(search.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  function handleSelect(c: Conv) {
    setSelected(c);
    setBotPausado(false);
    setShowIntervene(false);
    setMsg("");
    setShowChat(true); // on mobile, go to chat view
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-navy-500 bg-navy-900 px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white">Conversaciones</h1>
            <p className="text-xs text-white/50 mt-0.5 hidden sm:block">Un cerebro, cuatro canales — WhatsApp · Instagram · Telegram · Widget web</p>
          </div>
          <div className="flex items-center gap-2 bg-navy-800 border border-navy-500 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-green-400">Emma activa</span>
          </div>
        </div>
        {/* Channel filter chips */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          <button
            onClick={() => setChannelFilter("todos")}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition ${channelFilter === "todos" ? "border-cls-primary bg-cls-primary/15 text-cls-primary" : "border-navy-500 text-white/50 hover:text-white"}`}
          >
            Todos ({MOCK.length})
          </button>
          {ALL_CHANNELS.map((ch) => {
            const count = MOCK.filter((c) => c.channel === ch).length;
            return (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${channelFilter === ch ? CHANNEL_CLASS[ch] : "border-navy-500 text-white/50 hover:text-white"}`}
              >
                <span>{CHANNEL_ICON[ch]}</span> {CHANNEL_LABEL[ch]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* List panel — hidden on mobile when chat is open */}
        <aside className={`${showChat ? "hidden md:flex" : "flex"} w-full md:w-80 flex-shrink-0 border-r border-navy-500 bg-navy-900 flex-col overflow-hidden`}>
          <div className="p-3 border-b border-navy-500">
            <input
              className="w-full bg-navy-800 border border-navy-500 text-white rounded-lg px-3 py-1.5 text-xs placeholder-white/30 focus:outline-none focus:border-cls-primary"
              placeholder="Buscar contacto o tema..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-navy-500">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c)}
                className={`w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-navy-700 transition ${selected?.id === c.id ? "bg-cls-primary/10 border-l-2 border-l-cls-primary" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-navy-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 relative">
                  {c.nombre[0]}
                  <span className="absolute -bottom-1 -right-1 text-[10px]">{CHANNEL_ICON[c.channel]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white truncate">{c.nombre}</p>
                    <span className="text-[10px] text-white/40 flex-shrink-0 ml-2">{c.hora}</span>
                  </div>
                  <p className="text-xs text-white/50 truncate mt-0.5">{c.ultimoMensaje}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_CLASS[c.status]}`}>{c.status}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CHANNEL_CLASS[c.channel]}`}>{CHANNEL_LABEL[c.channel]}</span>
                    <span className="text-[10px] text-white/40 bg-navy-700 px-2 py-0.5 rounded-full">{c.topic}</span>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-white/30 text-center py-8">Sin conversaciones en este canal</p>
            )}
          </div>
        </aside>

        {/* Chat panel — hidden on mobile when list is shown */}
        <main className={`${showChat ? "flex" : "hidden md:flex"} flex-1 flex-col overflow-hidden bg-navy-800`}>
          {/* Chat header */}
          <div className="bg-navy-900 border-b border-navy-500 px-4 md:px-5 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Back button on mobile */}
              <button
                className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-navy-700 transition text-white/60 hover:text-white"
                onClick={() => setShowChat(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-cls-primary/20 text-cls-primary flex items-center justify-center text-sm font-bold">{selected.nombre[0]}</div>
              <div>
                <p className="text-sm font-semibold text-white">{selected.nombre}</p>
                <p className="text-xs text-white/50 hidden sm:block">{CHANNEL_ICON[selected.channel]} {selected.contacto}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {botPausado && (
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-yellow-400 bg-yellow-900/30 border border-yellow-800 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" /> Emma pausada
                </span>
              )}
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CHANNEL_CLASS[selected.channel]}`}>{CHANNEL_LABEL[selected.channel]}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_CLASS[selected.status]}`}>{selected.status}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4 space-y-3">
            {selected.msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
                {m.from === "user" && (
                  <div className="w-7 h-7 rounded-full bg-cls-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mr-2 mt-1">{selected.nombre[0]}</div>
                )}
                <div className={`max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.from === "user" ? "bg-cls-primary text-white rounded-tl-sm" : "bg-navy-700 text-white rounded-tr-sm"}`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.from === "user" ? "text-fuchsia-200 text-left" : "text-white/40 text-right"}`}>
                    {m.hora}{m.from === "user" && " ✓✓"}
                  </p>
                </div>
                {m.from === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-navy-600 flex items-center justify-center text-xs flex-shrink-0 ml-2 mt-1">🌱</div>
                )}
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="border-t border-navy-500 bg-navy-900 p-3 md:p-4 flex-shrink-0">
            {botPausado ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-yellow-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" /> Emma pausada en esta conversación
                  </p>
                  <button onClick={() => { setBotPausado(false); setShowIntervene(false); }} className="text-xs text-green-400 hover:text-white bg-green-500/10 border border-green-700/40 px-3 py-1 rounded-lg transition">
                    🌱 Reactivar
                  </button>
                </div>
                <div className="flex gap-2">
                  <textarea className="flex-1 bg-navy-800 border border-navy-500 text-white rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-cls-primary placeholder-white/30" rows={2} placeholder="Escribí tu mensaje..." value={msg} onChange={(e) => setMsg(e.target.value)} />
                  <button onClick={() => setMsg("")} className="bg-cls-primary hover:bg-cls-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition self-end">Enviar</button>
                </div>
              </div>
            ) : !showIntervene ? (
              <button onClick={() => setShowIntervene(true)} className="flex items-center gap-2 text-sm text-cls-primary hover:text-white font-semibold bg-cls-primary/10 hover:bg-cls-primary/20 border border-cls-primary/30 px-4 py-2 rounded-xl w-full justify-center transition">
                ✏️ Intervenir en esta conversación
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-yellow-400 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full" /> Al enviar, Emma pausa sus respuestas solo acá
                </p>
                <div className="flex gap-2">
                  <textarea className="flex-1 bg-navy-800 border border-navy-500 text-white rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-cls-primary placeholder-white/30" rows={2} placeholder="Escribí tu mensaje..." value={msg} onChange={(e) => setMsg(e.target.value)} autoFocus />
                  <div className="flex flex-col gap-1.5 self-end">
                    <button onClick={() => { setBotPausado(true); setMsg(""); }} className="bg-cls-primary hover:bg-cls-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition">Enviar</button>
                    <button onClick={() => { setShowIntervene(false); setMsg(""); }} className="text-xs text-white/40 hover:text-white/70 text-center">Cancelar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
