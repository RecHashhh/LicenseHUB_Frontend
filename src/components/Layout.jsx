import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EnterpriseSelector from "./EnterpriseSelector";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", helper: "Resumen operativo" },
  { to: "/licenses", label: "Licencias", helper: "Control de vigencia" },
  { to: "/requests", label: "Solicitudes", helper: "Flujo de aprobacion" },
  { to: "/reports", label: "Reportes", helper: "Informes ejecutivos" },
  { to: "/info", label: "Como contratar", helper: "Politica interna" }
];

const adminItems = [
  { to: "/enterprises", label: "Empresas", helper: "Gestionar dominios" },
  { to: "/software", label: "Software", helper: "Gestionar licencias/paquetes" }
];

const pageNames = {
  "/dashboard": "Dashboard Ejecutivo",
  "/licenses": "Licencias Autodesk",
  "/requests": "Solicitudes y Compras",
  "/reports": "Centro de Reportes",
  "/info": "Politicas de Contratacion",
  "/enterprises": "Gestión de Empresas",
  "/software": "Gestión de Software"
};

const Layout = ({ children }) => {
  const { role, logout } = useAuth();
  const location = useLocation();
  const pageName = pageNames[location.pathname] || "Panel de gestion";
  const [selectedEnterprise, setSelectedEnterprise] = useState(
    () => Number(localStorage.getItem('selectedEnterprise')) || null
  );

  return (
    <div className="min-h-screen px-3 py-3 text-slate-800 md:px-6 md:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1320px] grid-cols-1 gap-3 md:grid-cols-[280px_1fr]">
        <aside className="app-grid-pattern rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-100 shadow-2xl md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
          <p className="enterprise-kicker">RIPCON</p>
          <h1 className="mt-3 font-heading text-[1.7rem] font-semibold tracking-tight text-white">LicenseHub</h1>
          <p className="mt-1 text-sm text-slate-300">Gestion Autodesk empresarial</p>
          
          {/* Enterprise Selector */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase">Filtrar por empresa</p>
            <EnterpriseSelector 
              selectedId={selectedEnterprise} 
              onSelect={setSelectedEnterprise}
            />
          </div>
          
          <div className="mt-5 rounded-xl border border-teal-300/20 bg-teal-500/10 px-3 py-2 text-xs font-medium text-teal-200">
            Operacion corporativa activa
          </div>

          <nav className="mt-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 transition ${
                    isActive
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-200 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs opacity-75">{item.helper}</p>
              </NavLink>
            ))}
            
            {/* Admin Menu */}
            {role === "admin" && (
              <>
                <div className="my-4 border-t border-slate-700"></div>
                <p className="text-xs font-semibold text-slate-400 uppercase px-3 py-2">Administración</p>
                {adminItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-2.5 transition ${
                        isActive
                          ? "bg-white text-slate-900 shadow"
                          : "text-slate-200 hover:bg-slate-800 hover:text-white"
                      }`
                    }
                  >
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs opacity-75">{item.helper}</p>
                  </NavLink>
                ))}
              </>
            )}
          </nav>

          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-sm">
            <p className="font-semibold text-white">Rol actual: {role}</p>
            <p className="mt-1 text-xs text-slate-300">Sesion segura con permisos por perfil</p>
            <button
              type="button"
              onClick={logout}
              className="action-btn-accent mt-3 w-full"
            >
              Cerrar sesion
            </button>
          </div>
        </aside>

        <div className="surface-panel-strong overflow-hidden">
          <header className="border-b border-slate-300/70 bg-slate-50/80 px-5 py-4 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Autodesk License Manager</p>
                <p className="mt-1 font-heading text-xl font-semibold text-slate-900">{pageName}</p>
              </div>
              <p className="enterprise-kicker">Vista corporativa</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">Monitoreo, trazabilidad y gestion centralizada de licencias</p>
          </header>
          <main className="p-5 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
