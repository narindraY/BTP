import { FiArrowRight, FiCalendar, FiDollarSign } from "react-icons/fi";

const STATUS_CFG = {
  "En cours":   { bg: "rgba(12,122,196,0.10)",  text: "var(--secondary)" },
  "Terminé":    { bg: "rgba(70,231,137,0.15)",   text: "var(--primary)"   },
  "En attente": { bg: "rgba(6,11,39,0.08)",      text: "var(--primary)"   },
};

const TYPE_COLORS = {
  "Bâtiment":       "var(--secondary)",
  "Route":          "var(--hoover)",
  "Pont":           "var(--primary)",
  "Infrastructure": "var(--secondary)",
  "Autre":          "var(--primary)",
};

const TYPE_BG = {
  "var(--secondary)": "rgba(12,122,196,0.10)",
  "var(--hoover)":    "rgba(70,231,137,0.12)",
  "var(--primary)":   "rgba(6,11,39,0.07)",
};

const fmtDate   = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";
const fmtBudget = (b) => `${Number(b || 0).toLocaleString("fr-FR")} F`;

const ProjectCard = ({ project, onClick }) => {
  const { nom_projet, type_projet, status, budget_alloue, contrat_fin, avancement_moyen } = project;

  const statusCfg = STATUS_CFG[status] ?? STATUS_CFG["En attente"];
  const typeColor = TYPE_COLORS[type_projet] ?? "var(--primary)";
  const typeBg    = TYPE_BG[typeColor] ?? "rgba(6,11,39,0.07)";
  const avanc     = Math.round(avancement_moyen || 0);
  const done      = avanc >= 100;
  const barColor  = done ? "var(--hoover)" : "var(--secondary)";

  return (
    <div
      onClick={onClick}
      className="flex flex-col rounded-xl overflow-hidden cursor-pointer transition-shadow duration-150 hover:shadow-md"
      style={{
        background:  "var(--bg)",
        border:      "0.5px solid rgba(6,11,39,0.10)",
        boxShadow:   "0 1px 4px rgba(6,11,39,0.06)",
      }}
    >
      <div style={{ height: 3, background: typeColor }} />

      <div className="flex flex-col gap-4 p-4 flex-1">

        <div className="flex items-start justify-between gap-2">
          <h6 className="text-[15px] font-semibold leading-snug m-0" style={{ color: "var(--primary)" }}>
            {nom_projet}
          </h6>
          <span
            className="shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: statusCfg.bg, color: statusCfg.text }}
          >
            {status ?? "—"}
          </span>
        </div>

        <span
          className="self-start text-[11px] font-semibold px-2.5 py-1 rounded-md"
          style={{ background: typeBg, color: typeColor }}
        >
          {type_projet}
        </span>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12px]" style={{ color: "rgba(6,11,39,0.4)" }}>Avancement</span>
            <span className="text-[12px] font-semibold tabular-nums" style={{ color: barColor }}>{avanc}%</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: "rgba(6,11,39,0.07)" }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(avanc, 100)}%`, background: barColor }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3" style={{ borderTop: "0.5px solid rgba(6,11,39,0.07)" }}>
          {[
            { icon: <FiDollarSign size={11} />, label: "Budget",     value: fmtBudget(budget_alloue) },
            { icon: <FiCalendar   size={11} />, label: "Fin prévue", value: fmtDate(contrat_fin)      },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(6,11,39,0.4)" }}>
                {icon} {label}
              </span>
              <span className="text-[12px] font-semibold tabular-nums" style={{ color: "var(--primary)" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold"
        style={{
          borderTop:  "0.5px solid rgba(6,11,39,0.07)",
          color:      "var(--secondary)",
          background: "rgba(12,122,196,0.03)",
        }}
      >
        Voir les détails <FiArrowRight size={13} />
      </div>
    </div>
  );
};

export default ProjectCard;