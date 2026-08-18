import { useState, useRef, useEffect } from "react";
import { getBotResponse, classifyTopic, CLS_INFO } from "../data/clsKnowledge";
import { type Channel, CHANNEL_LABEL, CHANNEL_ICON, CHANNEL_CLASS } from "./Dashboard";

interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  time: string;
  topic?: string;
}

const QUICK_OPTIONS = [
  "¿Hay stock de automáticas?",
  "¿Qué precio tenés?",
  "¿Hacen envíos a todo el país?",
  "¿Es legal comprar semillas?",
  "Nunca cultivé, ¿por dónde arranco?",
  "¿Cómo tramito el REPROCANN?",
];

const ALL_CHANNELS: Channel[] = ["whatsapp", "instagram", "telegram", "web"];

function now() {
  return new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

function welcomeMsg(): Message {
  return { id: "0", from: "bot", text: CLS_INFO.saludo, time: now() };
}

export default function BotChat() {
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [messages, setMessages] = useState<Message[]>([welcomeMsg()]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      from: "user",
      text: text.trim(),
      time: now(),
      topic: classifyTopic(text),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botText = getBotResponse(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        from: "bot",
        text: botText,
        time: now(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  }

  return (
    <div className="p-4 md:p-6 h-screen flex flex-col gap-4 max-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Demo de Emma</h1>
          <p className="text-sm text-slate-400 mt-0.5">Un cerebro, cuatro canales — el adaptador cambia, la respuesta es la misma</p>
        </div>
        <span className="badge-green">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          En línea
        </span>
      </div>

      {/* Channel selector */}
      <div className="flex-shrink-0 flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mr-1">Simular canal:</span>
        {ALL_CHANNELS.map((ch) => (
          <button
            key={ch}
            onClick={() => setChannel(ch)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 ${channel === ch ? CHANNEL_CLASS[ch] : "border-navy-500 text-white/50 hover:text-white"}`}
          >
            <span>{CHANNEL_ICON[ch]}</span> {CHANNEL_LABEL[ch]}
          </button>
        ))}
      </div>

      {/* Quick options strip */}
      <div className="flex-shrink-0 flex items-center gap-2 flex-wrap">
        {QUICK_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => send(opt)}
            disabled={typing}
            className="text-xs text-slate-300 hover:text-white bg-navy-700 hover:bg-navy-600 border border-navy-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-full px-3 py-1.5 transition-colors whitespace-nowrap"
          >
            {opt}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-4 text-xs text-slate-500">
          <span>
            <span className="text-white font-medium">{messages.filter((m) => m.from === "user").length}</span> enviados
          </span>
          <button
            onClick={() => setMessages([welcomeMsg()])}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Chat window — full width */}
      <div className="flex-1 flex flex-col card overflow-hidden min-h-0">
        {/* Chat header */}
        <div className="px-4 py-3 border-b border-navy-500 flex items-center gap-3 bg-navy-900 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-cls-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            🌱
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Emma — Crazy Lady Seeds</p>
            <p className="text-[11px] text-green-400">en línea · simulando {CHANNEL_LABEL[channel]} {CHANNEL_ICON[channel]}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-navy-800">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.from === "user"
                    ? "bg-cls-primary text-white rounded-tr-sm"
                    : "bg-navy-600 text-slate-100 rounded-tl-sm"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-[10px] mt-1 text-right ${msg.from === "user" ? "text-fuchsia-200" : "text-slate-500"}`}>
                  {msg.time}
                  {msg.from === "user" && " ✓✓"}
                </p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-navy-600 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-navy-500 bg-navy-900 flex-shrink-0">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu consulta..."
              className="flex-1 bg-navy-700 border border-navy-500 rounded-full px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cls-primary transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="w-9 h-9 rounded-full bg-cls-primary hover:bg-cls-primary-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className="text-[10px] text-white/20 mt-2 text-center">Demo por palabra clave (como river) — el cerebro real va a consultar `products` en vivo cuando exista el Supabase del proyecto.</p>
        </div>
      </div>
    </div>
  );
}
