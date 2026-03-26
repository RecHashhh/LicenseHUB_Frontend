import { useState } from "react";
import { downloadPdfReport } from "../services/reportService";

const ReportsPage = () => {
  const [filters, setFilters] = useState({ status: "", user: "", software: "" });

  const onDownload = async () => {
    const blob = await downloadPdfReport({
      status: filters.status || undefined,
      user: filters.user || undefined,
      software: filters.software || undefined
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "licenses-report.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <header>
        <p className="enterprise-kicker">Analitica documental</p>
        <h2 className="section-title">Reportes PDF</h2>
        <p className="section-subtitle">Genera reportes generales o filtrados por estado, usuario o software.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="metric-mini">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Salida</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">PDF ejecutivo</p>
          <p className="mt-1 text-xs text-slate-500">Formato listo para comites y auditoria</p>
        </article>
        <article className="metric-mini">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Cobertura</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">Estado, usuario y software</p>
          <p className="mt-1 text-xs text-slate-500">Filtra por dimensiones operativas clave</p>
        </article>
        <article className="metric-mini">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Uso sugerido</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">Revision semanal</p>
          <p className="mt-1 text-xs text-slate-500">Mejora control de renovaciones y riesgo</p>
        </article>
      </div>

      <div className="surface-panel grid gap-2 p-4 md:grid-cols-3">
        <select
          className="field-input"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos los estados</option>
          <option value="Activa">Activas</option>
          <option value="Vencida">Vencidas</option>
          <option value="Proxima a vencer">Proximas a vencer</option>
        </select>
        <input
          placeholder="Usuario"
          className="field-input"
          value={filters.user}
          onChange={(e) => setFilters({ ...filters, user: e.target.value })}
        />
        <input
          placeholder="Software"
          className="field-input"
          value={filters.software}
          onChange={(e) => setFilters({ ...filters, software: e.target.value })}
        />
        <button onClick={() => setFilters({ status: "", user: "", software: "" })} className="action-btn-ghost md:col-span-3">
          Limpiar filtros
        </button>
        <button onClick={onDownload} className="action-btn-primary md:col-span-3">
          Generar y descargar PDF
        </button>
      </div>

      <article className="surface-panel p-5">
        <p className="text-sm text-slate-600">
          Tip: usa filtros para crear reportes por area, estado de vigencia o responsable,
          facilitando auditorias y seguimiento de cumplimiento.
        </p>
      </article>
    </section>
  );
};

export default ReportsPage;
