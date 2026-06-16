import { FiFileText, FiHome, FiDollarSign, FiTrendingUp } from "react-icons/fi";

const CARDS = [
  {
    key:    "totalContrats",
    label:  "Contrats",
    sub:    "contrats actifs",
    icon:   <FiFileText size={15} />,
    format: v => v,
  },
  {
    key:    "projetsActifs",
    label:  "Projets en cours",
    sub:    "en cours d'exécution",
    icon:   <FiHome size={15} />,
    format: v => v,
  },
  {
    key:    "budgetTotal",
    label:  "Budget total (FCFA)",
    sub:    "budget alloué",
    icon:   <FiDollarSign size={15} />,
    format: v => Number(v).toLocaleString("fr-FR"),
  },
  {
    key:    "avancementMoyen",
    label:  "Avancement moyen",
    sub:    "progression globale",
    icon:   <FiTrendingUp size={15} />,
    format: v => `${Math.round(Number(v) || 0)} %`,
  },
];

const StatCard = ({ label, sub, icon, format, value, index }) => {
  /* rotate accent between secondary and hoover */
  const accentVar  = index % 2 === 0 ? "var(--secondary)" : "var(--hoover)";
  const accentBg   = index % 2 === 0
    ? "rgba(12,122,196,0.08)"
    : "rgba(70,231,137,0.12)";

  return (
    <div
      className="relative flex flex-col gap-3 rounded-xl p-5 overflow-hidden"
      style={{
        background:  "var(--bg)",
        border:      "0.5px solid rgba(6,11,39,0.10)",
        boxShadow:   "0 1px 6px rgba(6,11,39,0.06)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 3, background: accentVar }}
      />

      <div className="flex items-center gap-2 pt-1">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: accentBg, color: accentVar }}
        >
          {icon}
        </div>
        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "var(--primary)" }}
        >
          {label}
        </span>
      </div>

      <div>
        <div
          className="font-mono font-semibold leading-none"
          style={{ fontSize: 22, color: accentVar }}
        >
          {format(value ?? 0)}
        </div>
        <div className="text-[11px] mt-1" style={{ color: "rgba(6,11,39,0.38)" }}>
          {sub}
        </div>
      </div>
    </div>
  );
};

const StatCards = ({ stats = {} }) => (
  <div className="grid grid-cols-4 gap-3">
    {CARDS.map((card, i) => (
      <StatCard key={card.key} {...card} value={stats[card.key]} index={i} />
    ))}
  </div>
);

export default StatCards;