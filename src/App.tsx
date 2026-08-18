import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/ScrollToTop";

// Público — la tienda
import PublicLayout from "./components/public/PublicLayout";
import Home from "./pages/public/Home";
import Semillas from "./pages/public/Semillas";
import Esquejes from "./pages/public/Esquejes";
import ProductoDetalle from "./pages/public/ProductoDetalle";
import Notas from "./pages/public/Notas";
import NotaDetalle from "./pages/public/NotaDetalle";
import Reprocann from "./pages/public/Reprocann";
import Carrito from "./pages/public/Carrito";

// Panel interno — productos + todo lo del bot
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import BotChat from "./pages/BotChat";
import Conversaciones from "./pages/Conversaciones";
import CRM from "./pages/CRM";
import Pipeline from "./pages/Pipeline";
import Productos from "./pages/Productos";
import Automatizaciones from "./pages/Automatizaciones";
import Broadcast from "./pages/Broadcast";
import Metricas from "./pages/Metricas";
import Configuracion from "./pages/Configuracion";

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        {/* ── TIENDA PÚBLICA ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/semillas" element={<Semillas />} />
          <Route path="/esquejes" element={<Esquejes />} />
          <Route path="/producto/:slug" element={<ProductoDetalle />} />
          <Route path="/notas" element={<Notas />} />
          <Route path="/notas/:slug" element={<NotaDetalle />} />
          <Route path="/reprocann" element={<Reprocann />} />
          <Route path="/carrito" element={<Carrito />} />
        </Route>

        {/* ── PANEL INTERNO ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="conversaciones" element={<Conversaciones />} />
          <Route path="crm" element={<CRM />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="productos" element={<Productos />} />
          <Route path="automatizaciones" element={<Automatizaciones />} />
          <Route path="broadcast" element={<Broadcast />} />
          <Route path="metricas" element={<Metricas />} />
          <Route path="bot" element={<BotChat />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
}
