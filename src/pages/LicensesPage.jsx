import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createLicense,
  exportLicenses,
  getLicenses,
  importLicenses,
  removeLicense
} from "../services/licenseService";
import { getSoftware } from "../services/softwareService";

const emptyForm = {
  cedula: "",
  nombre: "",
  cargo: "",
  proyecto: "",
  software_id: "",
  correos_personales: "",
  email_enviado_fecha: "",
  habilitacion_licencia_fecha: "",
  vencimiento_licencia_fecha: "",
  verificacion_cedula: false,
  verificacion_licencia: false,
  verificacion_nomina: false,
  observaciones: ""
};

const LicensesPage = () => {
  const { role } = useAuth();
  const [licenses, setLicenses] = useState([]);
  const [softwareList, setSoftwareList] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ cedula: "", nombre: "", software: "", status: "" });
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const payload = {
      cedula: filters.cedula || undefined,
      nombre: filters.nombre || undefined,
      software: filters.software || undefined,
      status: filters.status || undefined
    };
    const [licensesData, softwareData] = await Promise.all([
      getLicenses(payload),
      getSoftware()
    ]);
    setLicenses(licensesData);
    setSoftwareList(softwareData);
  };

  useEffect(() => {
    load().catch(() => null);
  }, []);

  const onCreate = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await createLicense({
        ...form,
        software_id: Number(form.software_id),
        verificacion_cedula: form.verificacion_cedula === true || form.verificacion_cedula === "true",
        verificacion_licencia: form.verificacion_licencia === true || form.verificacion_licencia === "true",
        verificacion_nomina: form.verificacion_nomina === true || form.verificacion_nomina === "true"
      });
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || "No fue posible crear la licencia");
    }
  };

  const onExport = async () => {
    const blob = await exportLicenses();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "licencias_autodesk.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const result = await importLicenses(file);
      setError(result.errors?.length > 0 ? `${result.created} creadas, ${result.errors.length} errores` : `${result.created} licencias importadas correctamente`);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || "No fue posible importar el archivo");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("¿Eliminar esta licencia?")) return;
    await removeLicense(id);
    await load();
  };

  const activeCount = licenses.filter((item) => item.status === "Activa").length;
  const expiringCount = licenses.filter((item) => item.status === "Proxima a vencer").length;
  const expiredCount = licenses.filter((item) => item.status === "Vencida").length;

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="enterprise-kicker">Licenciamiento</p>
          <h2 className="section-title">Gestion de licencias</h2>
          <p className="section-subtitle">CRUD, filtros, importacion y exportacion en Excel</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onExport} className="action-btn-primary">
            Exportar Excel
          </button>
          {role === "admin" && (
            <label className="action-btn-accent cursor-pointer">
              Importar Excel
              <input type="file" className="hidden" accept=".xlsx" onChange={onImport} />
            </label>
          )}
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="metric-mini">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Total visible</p>
          <p className="metric-mini-value">{licenses.length}</p>
        </article>
        <article className="metric-mini">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Activas</p>
          <p className="metric-mini-value text-emerald-700">{activeCount}</p>
        </article>
        <article className="metric-mini">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Por vencer</p>
          <p className="metric-mini-value text-amber-700">{expiringCount}</p>
        </article>
        <article className="metric-mini">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Vencidas</p>
          <p className="metric-mini-value text-rose-700">{expiredCount}</p>
        </article>
      </div>

      {error && (
        <p className={`rounded-md px-3 py-2 text-sm ${error.includes("incorrectamente") ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
          {error}
        </p>
      )}

      <div className="surface-panel grid gap-2 p-4 sm:grid-cols-2">
        <input
          placeholder="Filtrar por cedula"
          className="field-input"
          value={filters.cedula}
          onChange={(e) => setFilters({ ...filters, cedula: e.target.value })}
        />
        <input
          placeholder="Filtrar por nombre"
          className="field-input"
          value={filters.nombre}
          onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
        />
        <input
          placeholder="Filtrar por software"
          className="field-input"
          value={filters.software}
          onChange={(e) => setFilters({ ...filters, software: e.target.value })}
        />
        <select
          className="field-input"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos los estados</option>
          <option value="Activa">Activa</option>
          <option value="Vencida">Vencida</option>
          <option value="Proxima a vencer">Proxima a vencer</option>
        </select>
        <button onClick={load} className="action-btn-ghost sm:col-span-2">
          Aplicar filtros
        </button>
      </div>

      {role === "admin" && (
        <form onSubmit={onCreate} className="surface-panel grid gap-2 p-4 md:grid-cols-2">
          <h3 className="font-heading text-lg font-semibold md:col-span-2">Crear nueva licencia</h3>
          <input
            required
            placeholder="Cedula"
            className="field-input"
            value={form.cedula}
            onChange={(e) => setForm({ ...form, cedula: e.target.value })}
          />
          <input
            required
            placeholder="Nombre"
            className="field-input"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <input
            placeholder="Cargo"
            className="field-input"
            value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
          />
          <input
            placeholder="Proyecto"
            className="field-input"
            value={form.proyecto}
            onChange={(e) => setForm({ ...form, proyecto: e.target.value })}
          />
          <select required className="field-input" value={form.software_id} onChange={(e) => setForm({ ...form, software_id: e.target.value })}>
            <option value="">Selecciona software</option>
            {softwareList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Correos personales"
            className="field-input"
            value={form.correos_personales}
            onChange={(e) => setForm({ ...form, correos_personales: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha envio correo"
            className="field-input"
            value={form.email_enviado_fecha}
            onChange={(e) => setForm({ ...form, email_enviado_fecha: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha habilitacion"
            className="field-input"
            value={form.habilitacion_licencia_fecha}
            onChange={(e) => setForm({ ...form, habilitacion_licencia_fecha: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha vencimiento"
            className="field-input"
            value={form.vencimiento_licencia_fecha}
            onChange={(e) => setForm({ ...form, vencimiento_licencia_fecha: e.target.value })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.verificacion_cedula}
              onChange={(e) => setForm({ ...form, verificacion_cedula: e.target.checked })}
            />
            <span>Verificacion cedula</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.verificacion_licencia}
              onChange={(e) => setForm({ ...form, verificacion_licencia: e.target.checked })}
            />
            <span>Verificacion licencia</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.verificacion_nomina}
              onChange={(e) => setForm({ ...form, verificacion_nomina: e.target.checked })}
            />
            <span>Verificacion nomina</span>
          </label>
          <textarea
            placeholder="Observaciones"
            className="field-input min-h-24 md:col-span-2"
            value={form.observaciones}
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
          />
          <button className="action-btn-primary md:col-span-2">Crear licencia</button>
        </form>
      )}

      <div className="table-shell">
        <table className="min-w-full text-xs md:text-sm">
          <thead className="bg-slate-100/90 text-left">
            <tr>
              <th className="px-3 py-3">Cedula</th>
              <th className="px-3 py-3">Nombre</th>
              <th className="px-3 py-3">Cargo</th>
              <th className="px-3 py-3">Proyecto</th>
              <th className="px-3 py-3">Software</th>
              <th className="px-3 py-3">Vencimiento</th>
              <th className="px-3 py-3">Estado</th>
              {role === "admin" && <th className="px-3 py-3">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {licenses.map((license) => (
              <tr key={license.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                <td className="px-3 py-3">{license.cedula}</td>
                <td className="px-3 py-3 font-medium">{license.nombre}</td>
                <td className="px-3 py-3">{license.cargo || "-"}</td>
                <td className="px-3 py-3">{license.proyecto || "-"}</td>
                <td className="px-3 py-3">{license.software_name}</td>
                <td className="px-3 py-3">{license.vencimiento_licencia_fecha || "-"}</td>
                <td className="px-3 py-3">
                  <span className={`status-chip ${license.status === "Activa" ? "bg-emerald-100 text-emerald-700" : license.status === "Vencida" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                    {license.status}
                  </span>
                </td>
                {role === "admin" && (
                  <td className="px-3 py-3">
                    <button onClick={() => onDelete(license.id)} className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white hover:opacity-80">
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {licenses.length === 0 && (
              <tr>
                <td colSpan={role === "admin" ? 8 : 7} className="px-3 py-8 text-center text-sm text-slate-500">
                  No hay registros con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LicensesPage;
