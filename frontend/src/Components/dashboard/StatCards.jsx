import { FiFileText, FiHome, FiDollarSign, FiTrendingUp } from "react-icons/fi";

const CARDS = [
  {
    key: "totalContrats",
    label: "Contrats",
    sub: "contrats actifs",
    icon: <FiFileText size={15} />,
    accent: "#2563EB",
    bg: "#EFF4FF",
    format: v => v,
  },
  {
    key: "projetsActifs",
    label: "Projets en cours",
    sub: "en cours d'exécution",
    icon: <FiHome size={15} />,
    accent: "#16A34A",
    bg: "#F0FDF4",
    format: v => v,
  },
  {
    key: "budgetTotal",
    label: "Budget total (FCFA)",
    sub: "budget alloué",
    icon: <FiDollarSign size={15} />,
    accent: "#D97706",
    bg: "#FFFBEB",
    format: v => Number(v).toLocaleString("fr-FR"),
  },
  {
    key: "avancementMoyen",
    label: "Avancement moyen",
    sub: "progression globale",
    icon: <FiTrendingUp size={15} />,
    accent: "#7C3AED",
    bg: "#F5F3FF",
    format: v => `${Math.round(Number(v) || 0)} %`,
  },
];

const StatCard = ({ label, sub, icon, accent,  format, value }) => (
  <div className="relative shadow-md bg-white border border-gray-100 rounded-lg p-5 flex flex-col gap-3 overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--secondary)] "/>
    <div className="flex items-center">
      <div className="">{icon}</div>
      <span className="text-[11px] ml-2 font-bold uppercase tracking-widest text-[var(--primary)] ">
        {label}
      </span>
    </div>

    <div>
      <div
        className="font-mono font-medium leading-none"
        style={{ fontSize: 22, color: accent }}
      >
        {format(value ?? 0)}
      </div>
      <div className="text-[11px] text-gray-400 mt-1">{sub}</div>
    </div>
  </div>
);

const StatCards = ({ stats = {} }) => (
  <div className="grid grid-cols-4 gap-3">
    {CARDS.map(card => (
      <StatCard key={card.key} {...card} value={stats[card.key]} />
    ))}
  </div>
);

export default StatCards;