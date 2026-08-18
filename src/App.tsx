import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when route changes on mobile
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-navy-800">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={closeSidebar} />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-navy-900 border-b border-navy-500 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-navy-700 transition text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-sm font-black cls-wordmark">CRAZY LADY SEEDS</p>
          <div className="w-9" />
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/conversaciones" element={<Conversaciones />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/automatizaciones" element={<Automatizaciones />} />
            <Route path="/broadcast" element={<Broadcast />} />
            <Route path="/metricas" element={<Metricas />} />
            <Route path="/bot" element={<BotChat />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden flex-shrink-0">
          <MobileNav />
        </div>
      </main>
    </div>
  );
}
