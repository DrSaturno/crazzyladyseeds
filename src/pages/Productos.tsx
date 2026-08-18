import { useState } from "react";

type Tipo = "semilla" | "esqueje";
type Fotoperiodo = "automatica" | "fotoperiodica" | "cbd";

interface Producto {
  id: number; nombre: string; banco: string; tipo: Tipo; fotoperiodo: Fotoperiodo;
  precio: number; stock: number; inase: boolean; visible_web: boolean;
}

// Snapshot real del sheet "Stock actual Crazylady 18/08" (Drive) — se reemplaza por lectura en vivo de `products` en Supabase.
const INIT: Producto[] = [
  { id: 1, nombre: "AK47 Auto x4", banco: "Crazy Lady Seeds", tipo: "semilla", fotoperiodo: "automatica", precio: 21000, stock: 4, inase: false, visible_web: false },
  { id: 2, nombre: "Amnesia Haze Auto x4", banco: "Crazy Lady Seeds", tipo: "semilla", fotoperiodo: "automatica", precio: 21000, stock: 4, inase: false, visible_web: false },
  { id: 3, nombre: "Gorila Glue Auto x4", banco: "Crazy Lady Seeds", tipo: "semilla", fotoperiodo: "automatica", precio: 21000, stock: 4, inase: false, visible_web: false },
  { id: 4, nombre: "Mix x10", banco: "Crazy Lady Seeds", tipo: "semilla", fotoperiodo: "fotoperiodica", precio: 53000, stock: 85, inase: false, visible_web: false },
  { id: 5, nombre: "Colombian Gold #1 x4", banco: "Crazy Lady Seeds", tipo: "semilla", fotoperiodo: "fotoperiodica", precio: 21000, stock: 52, inase: false, visible_web: false },
  { id: 6, nombre: "White Widow x3", banco: "Buddha Seeds", tipo: "semilla", fotoperiodo: "fotoperiodica", precio: 36000, stock: 4, inase: false, visible_web: false },
  { id: 7, nombre: "Buddha Syrup Auto x3", banco: "Buddha Seeds", tipo: "semilla", fotoperiodo: "automatica", precio: 40000, stock: 5, inase: false, visible_web: false },
  { id: 8, nombre: "Medikit CBD x3", banco: "Buddha Seeds", tipo: "semilla", fotoperiodo: "cbd", precio: 41000, stock: 2, inase: false, visible_web: false },
  { id: 9, nombre: "Royal Highness CBD x3", banco: "Royal Queen Seeds", tipo: "semilla", fotoperiodo: "cbd", precio: 27000, stock: 2, inase: false, visible_web: false },
  { id: 10, nombre: "Amnesia", banco: "Sensi Seeds", tipo: "semilla", fotoperiodo: "fotoperiodica", precio: 50000, stock: 3, inase: false, visible_web: false },
  { id: 11, nombre: "0G 324", banco: "Silver River Seeds", tipo: "semilla", fotoperiodo: "fotoperiodica", precio: 39000, stock: 2, inase: true, visible_web: true },
  { id: 12, nombre: "Malvina Conicet x4", banco: "Cannabis Conicet", tipo: "semilla", fotoperiodo: "fotoperiodica", precio: 34000, stock: 2, inase: true, visible_web: true },
  { id: 13, nombre: "Esqueje Jet Puft", banco: "Compound Genetics", tipo: "esqueje", fotoperiodo: "fotoperiodica", precio: 22000, stock: 6, inase: false, visible_web: false },
];

const FOTOPERIODO_LABEL: Record<Fotoperiodo, string> = { automatica: "Automática", fotoperiodica: "Fotoperiódica", cbd: "CBD" };
const FOTOPERIODO_STYLE: Record<Fotoperiodo, string> = {
  automatica: "bg-blue-900/40 text-blue-300 border-blue-800",
  fotoperiodica: "bg-purple-900/40 text-purple-300 border-purple-800",
  cbd: "bg-teal-900/40 text-teal-300 border-teal-800",
};
const TIPOS: Tipo[] = ["semilla", "esqueje"];
const FOTOPERIODOS: Fotoperiodo[] = ["automatica", "fotoperiodica", "cbd"];

const EMPTY = { nombre: "", banco: "", tipo: "semilla" as Tipo, fotoperiodo: "fotoperiodica" as Fotoperiodo, precio: "", stock: "", inase: false, visible_web: false };

type ModalMode = { mode: "new" } | { mode: "edit"; producto: Producto } | { mode: "delete"; producto: Producto } | null;

export default function Productos() {
  const [productos, setProductos] = useState(INIT);
  const [modal, setModal] = useState<ModalMode>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);

  function openNew() { setForm(EMPTY); setModal({ mode: "new" }); }
  function openEdit(p: Producto) {
    setForm({ nombre: p.nombre, banco: p.banco, tipo: p.tipo, fotoperiodo: p.fotoperiodo, precio: String(p.precio), stock: String(p.stock), inase: p.inase, visible_web: p.visible_web });
    setModal({ mode: "edit", producto: p });
  }
  function openDelete(p: Producto) { setModal({ mode: "delete", producto: p }); }

  function handleSave() {
    const data = {
      nombre: form.nombre, banco: form.banco, tipo: form.tipo, fotoperiodo: form.fotoperiodo,
      precio: Number(form.precio) || 0, stock: Number(form.stock) || 0, inase: form.inase, visible_web: form.visible_web,
    };
    if (modal?.mode === "new") setProductos((prev) => [...prev, { ...data, id: Date.now() }]);
    else if (modal?.mode === "edit") setProductos((prev) => prev.map((p) => p.id === modal.producto.id ? { ...data, id: p.id } : p));
    setModal(null);
  }

  function handleDelete() {
    if (modal?.mode === "delete") setProductos((prev) => prev.filter((p) => p.id !== modal.producto.id));
    setModal(null);
  }

  function toggleVisible(id: number) {
    setProductos((prev) => prev.map((p) => p.id === id ? { ...p, visible_web: !p.visible_web } : p));
  }

  const inp = "w-full bg-navy-800 border border-navy-500 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cls-primary placeholder-white/30";
  const enStock = productos.filter((p) => p.stock > 0).length;
  const inaseCount = productos.filter((p) => p.inase).length;

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="border-b border-navy-500 bg-navy-900 px-6 py-4 flex-shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Catálogo</h1>
            <p className="text-xs text-white/50 mt-0.5">Semillas y esquejes — al cargar acá, Emma responde con esta info al instante</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cls-primary hover:bg-cls-primary-dark text-white text-xs font-bold transition">
            + Nuevo producto
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-navy-800">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-900/30 border border-green-800 flex items-center justify-center">
                <span className="text-green-400 text-lg">✓</span>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{enStock}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">En stock</p>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-900/30 border border-red-800 flex items-center justify-center">
                <span className="text-red-400 text-lg">✕</span>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{productos.length - enStock}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Sin stock</p>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cls-primary/20 border border-cls-primary/40 flex items-center justify-center">
                <span className="text-cls-primary text-lg">🌱</span>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{inaseCount}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Registradas INASE</p>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-600 border border-navy-500 flex items-center justify-center">
                <span className="text-white/40 text-lg">📦</span>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{productos.length}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Total</p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-white/40 mb-4">
            <strong className="text-white/60">visible_web</strong> decide si el producto aparece en la vidriera pública de la tienda — la propuesta prioriza mostrar primero genéticas registradas INASE. Es la decisión pendiente <strong className="text-white/60">D-04</strong> del SPEC; acá se puede togglear por producto.
          </p>

          {/* Products list */}
          <div className="space-y-3">
            {productos.map((p) => (
              <div key={p.id} className="card overflow-hidden hover:border-slate-500 transition group">
                <div className="flex">
                  {/* Color accent strip */}
                  <div
                    className="w-1.5 flex-shrink-0"
                    style={{ backgroundColor: p.stock > 0 ? "#22c55e" : "#ef4444" }}
                  />
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${FOTOPERIODO_STYLE[p.fotoperiodo]}`}>
                            {FOTOPERIODO_LABEL[p.fotoperiodo]}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-navy-500 text-white/50 bg-navy-800 capitalize">
                            {p.tipo}
                          </span>
                          {p.inase && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-cls-primary/40 bg-cls-primary/15 text-cls-primary">
                              🌱 INASE
                            </span>
                          )}
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.stock > 0 ? "bg-green-900/40 text-green-400 border-green-800" : "bg-red-900/30 text-red-400 border-red-900"}`}>
                            {p.stock > 0 ? `${p.stock} en stock` : "Sin stock"}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white leading-tight">{p.nombre}</h3>
                        <p className="text-xs text-white/40 mt-0.5">{p.banco}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button onClick={() => openEdit(p)} className="text-xs text-white/50 hover:text-white bg-navy-600 hover:bg-navy-500 px-3 py-1.5 rounded-lg transition">
                          ✏️ Editar
                        </button>
                        <button onClick={() => openDelete(p)} className="text-xs text-red-400 hover:text-white hover:bg-red-900/40 px-3 py-1.5 rounded-lg transition">
                          🗑 Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 bg-navy-900 rounded-lg px-3 py-2">
                        <span className="text-white/40 text-xs">$</span>
                        <div>
                          <p className="text-[10px] text-white/40">Precio</p>
                          <p className="text-xs font-bold text-white">${p.precio.toLocaleString("es-AR")}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleVisible(p.id)}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 border transition ${p.visible_web ? "bg-green-900/20 border-green-800" : "bg-navy-900 border-navy-600"}`}
                      >
                        <span className={`relative inline-flex h-4 w-7 flex-shrink-0 items-center rounded-full transition-colors ${p.visible_web ? "bg-green-500" : "bg-navy-500"}`}>
                          <span className="inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform" style={{ transform: p.visible_web ? "translateX(13px)" : "translateX(2px)" }} />
                        </span>
                        <p className="text-[10px] font-semibold text-white/70">{p.visible_web ? "Visible en la web" : "Fuera de la vidriera"}</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal New/Edit */}
      {(modal?.mode === "new" || modal?.mode === "edit") && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-navy-900 border border-navy-500 rounded-2xl p-6 w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white">{modal.mode === "new" ? "Nuevo producto" : "Editar producto"}</h2>
                <button onClick={() => setModal(null)} className="text-white/40 hover:text-white text-xl">×</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Nombre *</label>
                  <input className={inp} placeholder="Ej: White Widow x3" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Banco / obtentor</label>
                  <input className={inp} placeholder="Ej: Buddha Seeds" value={form.banco} onChange={(e) => setForm((f) => ({ ...f, banco: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Tipo</label>
                    <select className={inp} value={form.tipo} onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as Tipo }))}>
                      {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Fotoperíodo</label>
                    <select className={inp} value={form.fotoperiodo} onChange={(e) => setForm((f) => ({ ...f, fotoperiodo: e.target.value as Fotoperiodo }))}>
                      {FOTOPERIODOS.map((f) => <option key={f} value={f}>{FOTOPERIODO_LABEL[f]}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Precio (ARS)</label>
                    <input className={inp} type="number" placeholder="21000" value={form.precio} onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Stock</label>
                    <input className={inp} type="number" placeholder="4" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-white/70">
                    <input type="checkbox" checked={form.inase} onChange={(e) => setForm((f) => ({ ...f, inase: e.target.checked }))} />
                    Registrada INASE
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white/70">
                    <input type="checkbox" checked={form.visible_web} onChange={(e) => setForm((f) => ({ ...f, visible_web: e.target.checked }))} />
                    Visible en la web
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-navy-500 text-white/60 hover:text-white text-sm font-semibold transition">Cancelar</button>
                <button onClick={handleSave} disabled={!form.nombre.trim()} className="flex-[2] py-2.5 rounded-xl bg-cls-primary hover:bg-cls-primary-dark disabled:opacity-30 text-white text-sm font-bold transition">
                  {modal.mode === "new" ? "Crear producto" : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Delete */}
      {modal?.mode === "delete" && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-navy-900 border border-navy-500 rounded-2xl p-6 w-full max-w-sm pointer-events-auto shadow-2xl">
              <div className="flex items-center gap-3 mb-4"><span className="text-2xl">⚠️</span><h2 className="text-base font-bold text-white">Eliminar producto</h2></div>
              <p className="text-sm text-white/60 mb-1">¿Eliminar:</p>
              <p className="text-sm font-semibold text-white mb-5">"{modal.producto.nombre}"?</p>
              <div className="flex gap-3">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-navy-500 text-white/60 hover:text-white text-sm font-semibold transition">Cancelar</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-bold transition">Eliminar</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
