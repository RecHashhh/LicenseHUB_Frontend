import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getDashboardSummary } from "../services/reportService";

const DashboardPage = () => {
  const [summary, setSummary] = useState({
    total_licenses: 0,
    active_licenses: 0,
    expired_licenses: 0,
    expiring_licenses: 0
  });

  useEffect(() => {
    getDashboardSummary().then(setSummary).catch(() => null);
  }, []);

  const safeTotal = summary.total_licenses || 1;
  const activePct = Math.round((summary.active_licenses / safeTotal) * 100);
  const expiringPct = Math.round((summary.expiring_licenses / safeTotal) * 100);
  const expiredPct = Math.round((summary.expired_licenses / safeTotal) * 100);

  return (
    <section className="space-y-6">
      <header>
        <p className="enterprise-kicker">Panel ejecutivo</p>
        <h2 className="section-title">Dashboard</h2>
        <p className="section-subtitle">Estado en tiempo real de licencias Autodesk</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total" value={summary.total_licenses} />
        <StatCard title="Activas" value={summary.active_licenses} tone="ok" />
        <StatCard title="Vencidas" value={summary.expired_licenses} tone="danger" />
        <StatCard title="Proximas a vencer" value={summary.expiring_licenses} tone="warn" />
      </div>

      <article className="surface-panel p-5 md:p-6">
        <h3 className="font-heading text-xl font-semibold text-slate-900">Lectura ejecutiva</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Este tablero resume el estado operativo de licencias para detectar riesgo de vencimiento,
          mantener continuidad de proyectos y priorizar renovaciones con anticipacion.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="metric-mini">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Indice activo</p>
            <p className="metric-mini-value">{activePct}%</p>
            <div className="mt-2 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${activePct}%` }} />
            </div>
          </div>
          <div className="metric-mini">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Riesgo proximo</p>
            <p className="metric-mini-value">{expiringPct}%</p>
            <div className="mt-2 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-amber-500" style={{ width: `${expiringPct}%` }} />
            </div>
          </div>
          <div className="metric-mini">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Vencidas</p>
            <p className="metric-mini-value">{expiredPct}%</p>
            <div className="mt-2 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-rose-500" style={{ width: `${expiredPct}%` }} />
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default DashboardPage;
