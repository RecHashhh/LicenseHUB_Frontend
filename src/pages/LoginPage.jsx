import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@empresa.com", password: "admin123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "No fue posible iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center p-4 md:p-6">
      <div className="surface-panel-strong grid w-full max-w-5xl overflow-hidden md:grid-cols-[1.1fr_1fr]">
        <aside className="app-grid-pattern hidden border-r border-slate-200 bg-slate-900 p-8 text-white md:block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">RIPCON Plataforma</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight">LicenseHub</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-200">
            Gestion centralizada de licencias Autodesk para operaciones con trazabilidad,
            cumplimiento y control de renovaciones.
          </p>

          <div className="mt-8 space-y-3">
            <div className="rounded-xl border border-slate-700/80 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Seguridad</p>
              <p className="mt-1 text-sm font-medium">Autenticacion por rol y sesiones controladas</p>
            </div>
            <div className="rounded-xl border border-slate-700/80 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Operacion</p>
              <p className="mt-1 text-sm font-medium">Monitoreo de vigencias y flujo de aprobaciones</p>
            </div>
          </div>
        </aside>

        <form onSubmit={onSubmit} className="p-7 md:p-8">
          <p className="enterprise-kicker">Acceso corporativo</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-slate-900">Iniciar sesion</h2>
          <p className="mt-1 text-sm text-slate-600">Ingresa con tu usuario corporativo</p>

          {error && <p className="mt-4 rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p>}

          <label className="mt-5 block text-sm font-medium text-slate-700">Correo</label>
          <input
            className="field-input mt-1"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label className="mt-4 block text-sm font-medium text-slate-700">Contrasena</label>
          <input
            className="field-input mt-1"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="action-btn-primary mt-6 w-full disabled:opacity-70"
          >
            {loading ? "Ingresando..." : "Iniciar sesion"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">Portal interno para gestion profesional de activos Autodesk</p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
