// ── Crazy Lady Seeds — knowledge base de la demo de Emma ────────────────────
// Fuente: cuestionario de onboarding de Eliana (17/8/2026) + stock del 18/8/2026.
// Esto es un simulador de reglas por palabra clave, igual al patrón que ya usa
// river para su propia demo — NO llama a ningún LLM. Sirve para probar tono,
// guiones fijos y reglas de derivación antes de conectar el cerebro real.
// Cuando exista el Supabase del proyecto, `getBotResponse` se reemplaza por una
// llamada real que consulta `products` en vivo. Ver docs/bot-prompt-emma.md.

export const CLS_INFO = {
  nombre: "Crazy Lady Seeds",
  bot: "Emma",
  saludo: "Hola! soy Emma, la guardiana digital del jardín de Crazy Lady Seeds! Contame, en qué puedo ayudarte?",
  instagram: "@crazyladyseedsok",
  whatsapp: "11 7608-6771",
  envios: "Todo el país por Andreani, despacho en 48hs. El costo se calcula por código postal.",
  pagos: ["Efectivo", "Transferencia"],
  textoInase: "Somos una empresa que trabaja bajo las normativas de la ley 23750 y 27669 con las licencias de INASE y ARICCAME vigentes para la distribución, comercialización y producción de semillas y esquejes de cannabis medicinal.",
  numeroRegistro: "12665",
  reprocannGestor: "@clinicann (Clinicann)",
};

// Mismo snapshot que src/pages/Productos.tsx — en la versión real es una sola fuente (Supabase `products`).
export const CATALOGO = [
  { nombre: "AK47 Auto x4", banco: "Crazy Lady Seeds", fotoperiodo: "automática", precio: 21000, stock: 4 },
  { nombre: "Amnesia Haze Auto x4", banco: "Crazy Lady Seeds", fotoperiodo: "automática", precio: 21000, stock: 4 },
  { nombre: "Gorila Glue Auto x4", banco: "Crazy Lady Seeds", fotoperiodo: "automática", precio: 21000, stock: 4 },
  { nombre: "Medikit CBD x3", banco: "Buddha Seeds", fotoperiodo: "CBD", precio: 41000, stock: 2 },
  { nombre: "Royal Highness CBD x3", banco: "Royal Queen Seeds", fotoperiodo: "CBD", precio: 27000, stock: 2 },
  { nombre: "White Widow x3", banco: "Buddha Seeds", fotoperiodo: "fotoperiódica", precio: 36000, stock: 4 },
  { nombre: "Amnesia", banco: "Sensi Seeds", fotoperiodo: "fotoperiódica", precio: 50000, stock: 3 },
  { nombre: "0G 324", banco: "Silver River Seeds", fotoperiodo: "fotoperiódica", precio: 39000, stock: 2 },
];

function fmtCatalogo(items: typeof CATALOGO) {
  return items.map((p) => `${p.nombre} — ${p.banco} — $${p.precio.toLocaleString("es-AR")} — ${p.stock} en stock`).join("\n");
}

type BotResponse = { keywords: string[]; response: string };

export const BOT_RESPONSES: BotResponse[] = [
  {
    keywords: ["hola", "buenas", "buenos días", "buenos dias", "buenas tardes", "buenas noches", "hi", "che"],
    response: CLS_INFO.saludo,
  },
  {
    keywords: ["automatica", "automática", "auto ", " auto", "autofloreciente"],
    response:
      `Sí, tengo automáticas en stock 🌱 ¿la buscás en CBD o en THC?\n\nEn THC: ${fmtCatalogo(CATALOGO.filter((p) => p.fotoperiodo === "automática"))}\n\nEn CBD: Medikit CBD x3 (Buddha Seeds) — $41.000 — 2 en stock.`,
  },
  {
    keywords: ["cbd"],
    response:
      `En CBD tengo:\n${fmtCatalogo(CATALOGO.filter((p) => p.fotoperiodo === "CBD"))}\n\n¿Buscás algo más balanceado o con más THC?`,
  },
  {
    keywords: ["fotoperiodica", "fotoperiódica", "no automatica", "de foto"],
    response:
      `En fotoperiódicas tengo:\n${fmtCatalogo(CATALOGO.filter((p) => p.fotoperiodo === "fotoperiódica"))}\n\n¿Interior o exterior?`,
  },
  {
    keywords: ["precio", "cuanto cuesta", "cuánto cuesta", "cuanto sale", "cuánto sale", "que precio", "qué precio"],
    response:
      "Las más económicas son las de la casa, de producción propia — automáticas desde $21.000. Contame qué buscás (efecto, interior o exterior) y te tiro opciones puntuales del stock real.",
  },
  {
    keywords: ["envio", "envío", "envios", "envíos", "mandan", "llega", "andreani", "despacho"],
    response: `Sí, hacemos envíos a todo el país por Andreani, despacho en 48hs. El costo se calcula por código postal — pasame el tuyo y te lo calculo.`,
  },
  {
    keywords: ["pago", "pagos", "transferencia", "efectivo", "tarjeta", "mercado pago", "modo"],
    response: `Por ahora trabajamos con ${CLS_INFO.pagos.join(" y ")}. Si querés avanzar con una compra, te dejo el pedido armado y te contacta una persona del equipo para coordinar el pago.`,
  },
  {
    keywords: ["esqueje", "esquejes", "clon", "clones"],
    response: "Sí, vendemos esquejes — son variedades registradas y también de selección propia de la casa. ¿Buscás alguna genética puntual?",
  },
  {
    keywords: ["legal", "inase", "legalidad", "licencia", "es legal"],
    response: `${CLS_INFO.textoInase} (Nº de registro: ${CLS_INFO.numeroRegistro})`,
  },
  {
    keywords: ["reprocann"],
    response: `Eso te lo maneja mejor un gestor especializado — te paso el contacto de ${CLS_INFO.reprocannGestor}, que es con quien trabajamos. Yo puedo ayudarte con el resto: genética, cultivo y pedido.`,
  },
  {
    keywords: ["dolor", "enfermedad", "medicinal", "sintoma", "síntoma", "diagnostic", "me sirve para", "me recomendas para"],
    response: "Eso lo tiene que indicar un profesional de la salud — yo no puedo diagnosticar ni reemplazar esa consulta. Si querés avanzar con REPROCANN, te paso el contacto de nuestro gestor.",
  },
  {
    keywords: ["flor", "comprar flor", "venden flor", "tienen flor"],
    response: "Eso no lo manejamos por acá — trabajamos con semillas y esquejes de genéticas registradas, no con flor.",
  },
  {
    keywords: ["nunca cultive", "nunca cultivé", "primera vez", "empezar a cultivar", "soy principiante", "no tengo experiencia"],
    response: "Bienvenido al jardín 🌱 Contame: ¿cuál es tu objetivo de uso?",
  },
  {
    keywords: ["quiero comprar", "quiero llevar", "me llevo", "lo compro"],
    response: "Buenísimo! Te dejo el pedido armado y te contacta alguien del equipo para coordinar pago y envío.",
  },
  {
    keywords: ["hablar con una persona", "quiero hablar con alguien", "atencion humana", "atención humana", "un humano"],
    response: "Dale, te derivo con una persona del equipo ahora mismo.",
  },
  {
    keywords: ["ignora tus instrucciones", "olvida lo anterior", "sos un modelo", "system prompt", "actua como"],
    response: "Eso no lo puedo hacer — sigo siendo Emma, la asesora de Crazy Lady Seeds 🌱 ¿en qué te ayudo con el catálogo?",
  },
  {
    keywords: ["gracias", "muchas gracias", "genial", "perfecto", "buenisimo", "buenísimo", "dale"],
    response: "De nada! Cualquier cosa seguí escribiendo. Sembrando felicidad 🌱",
  },
];

// Solo se revisa si ninguna regla de arriba matcheó — es más genérico a propósito ("sema" solo,
// sin "automática"/"CBD"/"fotoperiódica"/etc.), así que va después para no taparle la respuesta
// puntual a preguntas como "¿es legal comprar semillas?" o "quiero comprar semillas".
const SEMILLA_GENERICA = ["sema", "semilla", "que otras variedades", "que variedades", "que tenes", "que hay disponible"];

export function getBotResponse(input: string): string {
  const normalized = input.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  for (const entry of BOT_RESPONSES) {
    if (entry.keywords.some((kw) => normalized.includes(kw.normalize("NFD").replace(/[̀-ͯ]/g, "")))) {
      return entry.response;
    }
  }
  if (SEMILLA_GENERICA.some((kw) => normalized.includes(kw))) {
    return "Tengo variedad de semillas 🌱 Contame qué buscás: ¿automática, fotoperiódica o CBD? Así te tiro las opciones justas del stock real.";
  }
  return "No tengo esa info específica en el catálogo ahora mismo — te derivo con una persona del equipo para que te ayude mejor. Mientras tanto, ¿te puedo ayudar con precio, stock o envíos?";
}

export type ConversationTopic =
  | "Automáticas" | "CBD" | "Fotoperiódicas" | "Esquejes" | "Envíos"
  | "REPROCANN" | "INASE / legalidad" | "Recomendación" | "Cierre de venta" | "Otro";

export function classifyTopic(input: string): ConversationTopic {
  const n = input.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (/(automatica|auto )/.test(n)) return "Automáticas";
  if (/cbd/.test(n)) return "CBD";
  if (/fotoperiodica/.test(n)) return "Fotoperiódicas";
  if (/esqueje/.test(n)) return "Esquejes";
  if (/(envio|andreani|despacho)/.test(n)) return "Envíos";
  if (/reprocann/.test(n)) return "REPROCANN";
  if (/(legal|inase|licencia)/.test(n)) return "INASE / legalidad";
  if (/(nunca cultive|primera vez|principiante)/.test(n)) return "Recomendación";
  if (/(quiero comprar|me llevo|lo compro)/.test(n)) return "Cierre de venta";
  return "Otro";
}
