import { useMemo, useState } from "react";
import {
  PRODUCTOS,
  BANCOS,
  esInase,
  precioARS,
  TIPO_LABEL,
  GENETICA_LABEL,
  ORIGEN_LABEL,
  type Producto,
  type TipoSemilla,
  type Genetica,
  type Origen,
  type Categoria,
} from "../data/catalogo";

// Este panel y la tienda pública leen del MISMO catálogo (src/data/catalogo.ts).
// Es el punto central de la arquitectura que definió Nico: lo que se carga acá
// impacta la vidriera y la respuesta de Emma sin sincronización de por medio.
// Cuando exista el Supabase del proyecto, `catalogo.ts` se reemplaza por la
// tabla `products` y esto pasa a escribir ahí.

const TIPO_STYLE: Record<TipoSemilla, string> = {
  feminizada: "bg-fuchsia-900/40 text-fuchsia-300 border-fuchsia-800",
  automatica: "bg-blue-900/40 text-blue-300 border-blue-800",
  cbd: "bg-teal-900/40 text-teal-300 border-teal-800",
};

const TIPOS: TipoSemilla[] = ["feminizada", "automatica", "cbd"];
const GENETICAS: Genetica[] = ["indica", "sativa", "hibrida"];
const ORIGENES: Origen[] = ["nacional", "importada"];
const CATEGORIAS: Categoria[] = ["semilla", "esqueje"];

const EMPTY = {
  nombre: "",
  banco: "Crazy Lady Seeds",
  categoria: "semilla" as Categoria,
  origen: "nacional" as Origen,
  tipo: "feminizada" as TipoSemilla,
  genetica: "hibrida" as Genetica,
  precio: "",
  stock: "",
  presentacion: "x3",
  visible_web: true,
};

type ModalMode = { mode: "new" } | { mode: "edit"; producto: Producto } | { mode: "delete"; producto: Producto } | null;

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS);
  const [modal, setModal] = useState<ModalMode>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [busqueda, setBusqueda] = useState("");
  const [soloSinStock, setSoloSinStock] = useState(false);

  const visibles = useMemo(() => {
    return productos.filter((p) => {
      if (soloSinStock && p.stock > 0) return false;
      if (!busqueda.trim()) return true;
      const q = busqueda.toLowerCase();
      return p.nombre.toLowerCase().includes(q) || p.banco.toLowerCase().includes(q);
    });
  }, [productos, busqueda, soloSinStock]);

  function openNew() {
    setForm(EMPTY);
    setModal({ mode: "new" });
  }

  function openEdit(p: Producto) {
    setForm({
      nombre: p.nombre,
      banco: p.banco,
      categoria: p.categoria,
      origen: p.origen,
      tipo: p.tipo,
      genetica: p.genetica,
      precio: String(p.precio),
      stock: String(p.stock),
      presentacion: p.presentacion,
      visible_web: p.visible_web ?? true,
    });
    setModal({ mode: "edit", producto: p });
  }

  function handleSave() {
    const base = {
      nombre: form.nombre,
      banco: form.banco,
      categoria: form.categoria,
      origen: form.origen,
      tipo: form.tipo,
      genetica: form.genetica,
      precio: Number(form.precio) || 0,
      stock: Number(form.stock) || 0,
      presentacion: form.presentacion,
      visible_web: form.visible_web,
    };
    if (modal?.mode === "new") {
      const id = `nuevo-${Date.now()}`;
      setProductos((prev) => [{ ...base, id, slug: id }, ...prev]);
    } else if (modal?.mode === "edit") {
      setProductos((prev) =>
        prev.map((p) => (p.id === modal.producto.id ? { ...p, ...base } : p))
      );
    }
    setModal(null);
  }

  function handleDelete() {
    if (modal?.mode === "delete") {
      setProductos((prev) => prev.filter((p) => p.id !== modal.producto.id));
    }
    setModal(null);
  }

  function toggleVisible(id: string) {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible_web: !(p.visible_web ?? true) } : p))
    );
  }

  const inp =
    "w-full bg-navy-800 border border-navy-500 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cls-primary placeholder-white/30";
  const enStock = productos.filter((p) => p.stock > 0).length;
  const inaseCount = productos.filter((p) => esInase(p.banco)).length;
  const enVidriera = productos.filter((p) => p.visible_web ?? true).length;

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="border-b border-navy-500 bg-navy-900 px-4 md:px-6 py-4 flex-shrink-0 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-white">Catálogo</h1>
            <p className="text-xs text-white/50 mt-0.5 hidden sm:block">
              Lo que cargás acá impacta la tienda y las respuestas de Emma al instante
            </p>
          </div>
          <button
            onClick={openNew}
            className="flex-shrink-0 px-3 md:px-4 py-2 rounded-lg bg-cls-primary hover:bg-cls-primary-dark text-white text-xs font-bold transition"
          >
            + Nuevo
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-navy-800">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
            <Stat valor={enStock} label="En stock" color="text-green-400" borde="border-green-800" icono="✓" />
            <Stat valor={productos.length - enStock} label="Sin stock" color="text-red-400" borde="border-red-800" icono="✕" />
            <Stat valor={inaseCount} label="Registradas INASE" color="text-cls-primary" borde="border-cls-primary/40" icono="🌱" />
            <Stat valor={enVidriera} label="En la vidriera" color="text-white" borde="border-navy-500" icono="🛒" />
          </div>

          {/* Buscador */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o banco..."
              className="flex-1 min-w-[220px] max-w-sm bg-navy-700 border border-navy-500 text-white rounded-lg px-4 py-2 text-sm placeholder-white/30 focus:outline-none focus:border-cls-primary"
            />
            <button
              onClick={() => setSoloSinStock((v) => !v)}
              className={`text-xs font-bold px-3.5 py-2 rounded-full border transition ${
                soloSinStock
                  ? "border-red-700 bg-red-900/30 text-red-400"
                  : "border-navy-500 text-white/50 hover:text-white"
              }`}
            >
              Solo sin stock
            </button>
            <span className="text-xs text-white/40 ml-auto">
              {visibles.length} de {productos.length}
            </span>
          </div>

          <p className="text-[11px] text-white/40 mb-4 leading-relaxed max-w-3xl">
            <strong className="text-white/60">visible_web</strong> decide si el producto aparece en la
            vidriera pública. El criterio final (¿INASE primero, o disponibilidad primero?) es la
            decisión <strong className="text-white/60">D-04</strong> del SPEC, todavía abierta con el
            cliente.
          </p>

          {/* Lista */}
          <div className="space-y-2.5">
            {visibles.map((p) => {
              const visible = p.visible_web ?? true;
              return (
                <div
                  key={p.id}
                  className="card overflow-hidden hover:border-slate-500 transition group"
                >
                  <div className="flex">
                    <div
                      className="w-1.5 flex-shrink-0"
                      style={{ backgroundColor: p.stock > 0 ? "#22c55e" : "#ef4444" }}
                    />
                    <div className="flex-1 p-4 md:p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TIPO_STYLE[p.tipo]}`}>
                              {TIPO_LABEL[p.tipo]}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-navy-500 text-white/50 bg-navy-800">
                              {GENETICA_LABEL[p.genetica]}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-navy-500 text-white/50 bg-navy-800">
                              {ORIGEN_LABEL[p.origen]}
                            </span>
                            {p.categoria === "esqueje" && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-navy-500 text-white/50 bg-navy-800">
                                Esqueje
                              </span>
                            )}
                            {esInase(p.banco) && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-cls-primary/40 bg-cls-primary/15 text-cls-primary">
                                🌱 INASE
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                p.stock > 0
                                  ? "bg-green-900/40 text-green-400 border-green-800"
                                  : "bg-red-900/30 text-red-400 border-red-900"
                              }`}
                            >
                              {p.stock > 0 ? `${p.stock} en stock` : "Sin stock"}
                            </span>
                          </div>
                          <h3 className="text-sm md:text-base font-bold text-white leading-tight truncate">
                            {p.nombre}
                          </h3>
                          <p className="text-xs text-white/40 mt-0.5">
                            {p.banco} · {p.presentacion}
                          </p>
                        </div>
                        <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => openEdit(p)}
                            className="text-xs text-white/50 hover:text-white bg-navy-600 hover:bg-navy-500 px-3 py-1.5 rounded-lg transition"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setModal({ mode: "delete", producto: p })}
                            className="text-xs text-red-400 hover:text-white hover:bg-red-900/40 px-3 py-1.5 rounded-lg transition"
                          >
                            🗑
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-navy-900 rounded-lg px-3 py-2">
                          <p className="text-[10px] text-white/40">Precio</p>
                          <p className="text-xs font-bold text-white">{precioARS(p.precio)}</p>
                        </div>
                        <button
                          onClick={() => toggleVisible(p.id)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 border transition ${
                            visible ? "bg-green-900/20 border-green-800" : "bg-navy-900 border-navy-600"
                          }`}
                        >
                          <span
                            className={`relative inline-flex h-4 w-7 flex-shrink-0 items-center rounded-full transition-colors ${
                              visible ? "bg-green-500" : "bg-navy-500"
                            }`}
                          >
                            <span
                              className="inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform"
                              style={{ transform: visible ? "translateX(13px)" : "translateX(2px)" }}
                            />
                          </span>
                          <p className="text-[10px] font-semibold text-white/70">
                            {visible ? "Visible en la web" : "Fuera de la vidriera"}
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {visibles.length === 0 && (
              <div className="text-center py-16 border border-dashed border-navy-500 rounded-2xl">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-sm text-white/60">No hay productos con esa búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal alta / edición */}
      {(modal?.mode === "new" || modal?.mode === "edit") && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-navy-900 border border-navy-500 rounded-2xl p-6 w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white">
                  {modal.mode === "new" ? "Nuevo producto" : "Editar producto"}
                </h2>
                <button onClick={() => setModal(null)} className="text-white/40 hover:text-white text-xl">
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <Campo label="Nombre *">
                  <input
                    className={inp}
                    placeholder="Ej: White Widow x3"
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  />
                </Campo>
                <Campo label="Banco / obtentor">
                  <select
                    className={inp}
                    value={form.banco}
                    onChange={(e) => setForm((f) => ({ ...f, banco: e.target.value }))}
                  >
                    {BANCOS.map((b) => (
                      <option key={b.slug} value={b.nombre}>
                        {b.nombre}
                        {b.inase ? " (INASE)" : ""}
                      </option>
                    ))}
                    <option value="A confirmar">A confirmar</option>
                  </select>
                </Campo>
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Categoría">
                    <select
                      className={inp}
                      value={form.categoria}
                      onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value as Categoria }))}
                    >
                      {CATEGORIAS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Campo>
                  <Campo label="Origen">
                    <select
                      className={inp}
                      value={form.origen}
                      onChange={(e) => setForm((f) => ({ ...f, origen: e.target.value as Origen }))}
                    >
                      {ORIGENES.map((o) => (
                        <option key={o} value={o}>{ORIGEN_LABEL[o]}</option>
                      ))}
                    </select>
                  </Campo>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Tipo">
                    <select
                      className={inp}
                      value={form.tipo}
                      onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as TipoSemilla }))}
                    >
                      {TIPOS.map((t) => (
                        <option key={t} value={t}>{TIPO_LABEL[t]}</option>
                      ))}
                    </select>
                  </Campo>
                  <Campo label="Genética">
                    <select
                      className={inp}
                      value={form.genetica}
                      onChange={(e) => setForm((f) => ({ ...f, genetica: e.target.value as Genetica }))}
                    >
                      {GENETICAS.map((g) => (
                        <option key={g} value={g}>{GENETICA_LABEL[g]}</option>
                      ))}
                    </select>
                  </Campo>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Campo label="Precio (ARS)">
                    <input
                      className={inp}
                      type="number"
                      placeholder="21000"
                      value={form.precio}
                      onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))}
                    />
                  </Campo>
                  <Campo label="Stock">
                    <input
                      className={inp}
                      type="number"
                      placeholder="4"
                      value={form.stock}
                      onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    />
                  </Campo>
                  <Campo label="Presentación">
                    <input
                      className={inp}
                      placeholder="x3"
                      value={form.presentacion}
                      onChange={(e) => setForm((f) => ({ ...f, presentacion: e.target.value }))}
                    />
                  </Campo>
                </div>
                <label className="flex items-center gap-2 text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={form.visible_web}
                    onChange={(e) => setForm((f) => ({ ...f, visible_web: e.target.checked }))}
                  />
                  Mostrar en la vidriera pública
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-navy-500 text-white/60 hover:text-white text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.nombre.trim()}
                  className="flex-[2] py-2.5 rounded-xl bg-cls-primary hover:bg-cls-primary-dark disabled:opacity-30 text-white text-sm font-bold transition"
                >
                  {modal.mode === "new" ? "Crear producto" : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal borrado */}
      {modal?.mode === "delete" && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-navy-900 border border-navy-500 rounded-2xl p-6 w-full max-w-sm pointer-events-auto shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚠️</span>
                <h2 className="text-base font-bold text-white">Eliminar producto</h2>
              </div>
              <p className="text-sm text-white/60 mb-1">¿Eliminar:</p>
              <p className="text-sm font-semibold text-white mb-5">"{modal.producto.nombre}"?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-navy-500 text-white/60 hover:text-white text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-bold transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function Stat({
  valor,
  label,
  color,
  borde,
  icono,
}: {
  valor: number;
  label: string;
  color: string;
  borde: string;
  icono: string;
}) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl bg-navy-900 border ${borde} flex items-center justify-center flex-shrink-0`}>
        <span className={`text-lg ${color}`}>{icono}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xl md:text-2xl font-black text-white leading-none">{valor}</p>
        <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
