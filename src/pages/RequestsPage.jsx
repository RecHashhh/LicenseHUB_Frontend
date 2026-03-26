import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createRequest, getRequests, updateRequestStatus } from "../services/requestService";
import { getSoftware } from "../services/softwareService";
import { getUsers } from "../services/userService";

const initialForm = {
  request_type: "Nueva licencia",
  user_id: "",
  software_id: "",
  project_name: "",
  justification: "",
  required_date: "",
  payment_method: "",
  contact_info: "",
  process_owner: ""
};

const RequestsPage = () => {
  const { role } = useAuth();
  const [requests, setRequests] = useState([]);
  const [softwareList, setSoftwareList] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);

  const load = async () => {
    const [requestData, softwareData, usersData] = await Promise.all([
      getRequests(),
      getSoftware(),
      getUsers()
    ]);
    setRequests(requestData);
    setSoftwareList(softwareData);
    setUsers(usersData);
  };

  useEffect(() => {
    load().catch(() => null);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await createRequest({
        ...form,
        user_id: Number(form.user_id),
        software_id: Number(form.software_id)
      });
      setForm(initialForm);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || "No fue posible crear la solicitud");
    }
  };

  const changeStatus = async (id, status) => {
    await updateRequestStatus(id, status);
    await load();
  };

  const pendingCount = requests.filter((item) => item.status === "Pendiente").length;
  const approvedCount = requests.filter((item) => item.status === "Aprobada").length;
  const rejectedCount = requests.filter((item) => item.status === "Rechazada").length;

  return (
    <section className="space-y-6">
      <header>
        <p className="enterprise-kicker">Flujo de compras</p>
        <h2 className="section-title">Solicitudes y contratacion</h2>
        <p className="section-subtitle">Gestiona nuevas licencias y renovaciones con trazabilidad.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="metric-mini">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Solicitudes</p>
          <p className="metric-mini-value">{requests.length}</p>
        </article>
        <article className="metric-mini">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Pendientes</p>
          <p className="metric-mini-value text-amber-700">{pendingCount}</p>
        </article>
        <article className="metric-mini">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Aprobadas</p>
          <p className="metric-mini-value text-emerald-700">{approvedCount}</p>
        </article>
        <article className="metric-mini">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Rechazadas</p>
          <p className="metric-mini-value text-rose-700">{rejectedCount}</p>
        </article>
      </div>

      <article className="surface-panel p-4">
        <h3 className="font-heading text-xl">Como solicitar una licencia</h3>
        <p className="mt-2 text-sm text-slate-600">
          Requisitos: nombre de usuario, proyecto, justificacion de negocio y fecha requerida.
        </p>
      </article>

      {error && <p className="rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <form onSubmit={onSubmit} className="surface-panel grid gap-2 p-4 md:grid-cols-3">
        <select
          className="field-input"
          value={form.request_type}
          onChange={(e) => setForm({ ...form, request_type: e.target.value })}
        >
          <option>Nueva licencia</option>
          <option>Renovacion</option>
        </select>
        <select
          required
          className="field-input"
          value={form.user_id}
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
        >
          <option value="">Selecciona usuario</option>
          {users.map((item) => (
            <option key={item.id} value={item.id}>
              {item.full_name} ({item.email})
            </option>
          ))}
        </select>
        <select
          required
          className="field-input"
          value={form.software_id}
          onChange={(e) => setForm({ ...form, software_id: e.target.value })}
        >
          <option value="">Selecciona software</option>
          {softwareList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          required
          placeholder="Proyecto"
          className="field-input"
          value={form.project_name}
          onChange={(e) => setForm({ ...form, project_name: e.target.value })}
        />
        <input
          required
          type="date"
          className="field-input"
          value={form.required_date}
          onChange={(e) => setForm({ ...form, required_date: e.target.value })}
        />
        <input
          placeholder="Metodo de pago"
          className="field-input"
          value={form.payment_method}
          onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
        />
        <input
          placeholder="Contacto"
          className="field-input"
          value={form.contact_info}
          onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
        />
        <input
          placeholder="Responsable"
          className="field-input"
          value={form.process_owner}
          onChange={(e) => setForm({ ...form, process_owner: e.target.value })}
        />
        <textarea
          required
          placeholder="Justificacion"
          className="field-input min-h-24 md:col-span-3"
          value={form.justification}
          onChange={(e) => setForm({ ...form, justification: e.target.value })}
        />
        <button className="action-btn-primary md:col-span-3">
          Enviar solicitud
        </button>
      </form>

      <div className="table-shell">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Usuario</th>
              <th className="px-3 py-2">Software</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Fecha requerida</th>
              {role === "admin" && <th className="px-3 py-2">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                <td className="px-3 py-2">{item.request_type}</td>
                <td className="px-3 py-2">{item.user_name}</td>
                <td className="px-3 py-2">{item.software_name}</td>
                <td className="px-3 py-2">
                  <span className={`status-chip ${item.status === "Aprobada" ? "bg-emerald-100 text-emerald-700" : item.status === "Rechazada" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-3 py-2">{item.required_date}</td>
                {role === "admin" && (
                  <td className="px-3 py-2 space-x-1">
                    <button
                      onClick={() => changeStatus(item.id, "Aprobada")}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs text-white"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => changeStatus(item.id, "Rechazada")}
                      className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs text-white"
                    >
                      Rechazar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={role === "admin" ? 6 : 5} className="px-3 py-8 text-center text-sm text-slate-500">
                  No hay solicitudes registradas en este momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RequestsPage;
