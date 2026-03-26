const InfoPage = () => {
  return (
    <section className="space-y-6">
      <header>
        <p className="enterprise-kicker">Politica interna</p>
        <h2 className="section-title">Informacion de contratacion</h2>
        <p className="section-subtitle">Guia interna para nuevas licencias Autodesk.</p>
      </header>

      <article className="surface-panel p-6">
        <h3 className="font-heading text-xl">Proceso recomendado</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Registrar solicitud desde el modulo Solicitudes.</li>
          <li>Adjuntar justificacion y proyecto asociado.</li>
          <li>Validar presupuesto con el responsable del proceso.</li>
          <li>Definir metodo de pago y contacto administrativo.</li>
          <li>Aprobar y ejecutar provision de licencia.</li>
        </ol>
      </article>

      <article className="rounded-2xl border border-amber-200 bg-amber-50/90 p-6 shadow-sm">
        <h3 className="font-heading text-xl text-amber-900">Datos para pago</h3>
        <p className="mt-2 text-sm text-amber-900">
          Metodo sugerido: transferencia bancaria corporativa. Contacto: compras@empresa.com.
        </p>
      </article>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="surface-panel p-5">
          <h3 className="font-heading text-lg font-semibold text-slate-900">Controles de gobierno</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Validar necesidad de negocio y presupuesto.</li>
            <li>Registrar responsable y fecha requerida.</li>
            <li>Conservar evidencias para auditoria interna.</li>
          </ul>
        </article>
        <article className="surface-panel p-5">
          <h3 className="font-heading text-lg font-semibold text-slate-900">SLA recomendado</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Revision inicial: 24 horas habiles.</li>
            <li>Aprobacion administrativa: 48 horas habiles.</li>
            <li>Provision de licencia: segun proveedor.</li>
          </ul>
        </article>
      </div>
    </section>
  );
};

export default InfoPage;
