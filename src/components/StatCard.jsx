const StatCard = ({ title, value, tone = "default" }) => {
  const tones = {
    default: "border-slate-200 bg-slate-50/90",
    ok: "border-emerald-200 bg-emerald-50/75",
    warn: "border-amber-200 bg-amber-50/75",
    danger: "border-rose-200 bg-rose-50/75"
  };

  return (
    <article className={`stagger-in rounded-2xl border p-5 shadow-sm ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <h3 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-slate-900">{value}</h3>
      <p className="mt-1 text-xs text-slate-500">Actualizado en tiempo real</p>
    </article>
  );
};

export default StatCard;
