import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
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

// La tienda pública vive en otro repo (github.com/DrSaturno/crazyladyweb) —
// ver docs/web.md § Dos repos. Este repo es solo el panel/tablero del bot.

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
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
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
}
