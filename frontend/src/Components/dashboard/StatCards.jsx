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
 
];

const VARIANTS = [
  {
    bar:     "bg-[#0c7ac4]",
    iconBg:  "bg-[#0c7ac4]/10",
    iconTxt: "text-[#0c7ac4]",
    valTxt:  "text-[#0c7ac4]",
  },
  {
    bar:     "bg-[#46e789]",
    iconBg:  "bg-[#46e789]/15",
    iconTxt: "text-[#46e789]",
    valTxt:  "text-[#46e789]",
  },
];

const StatCard = ({ label, sub, icon, format, value, index }) => {
  const v = VARIANTS[index % 2];

  return (
    <div className="relative flex flex-col gap-3 rounded-xl p-5 overflow-hidden bg-white border border-black/10 shadow-sm">
      {/* barre colorée en haut */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${v.bar}`} />

      <div className="flex items-center gap-2 pt-1">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${v.iconBg} ${v.iconTxt}`}>
          {icon}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#060b27]">
          {label}
        </span>
      </div>

      <div>
        <div className={`font-mono font-semibold text-[22px] leading-none ${v.valTxt}`}>
          {format(value ?? 0)}
        </div>
        <div className="text-[11px] mt-1 text-black/40">
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