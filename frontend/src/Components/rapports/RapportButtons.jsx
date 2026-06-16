import { FiCalendar, FiClock, FiDollarSign } from "react-icons/fi";
import api from "../../services/api";

const RAPPORTS = [
  { type: "journalier", label: "Rapport Journalier", icon: FiClock, desc: "Activités du jour" },
  { type: "mensuel",    label: "Rapport Mensuel",    icon: FiCalendar, desc: "Récapitulatif mensuel" },
  { type: "financier",  label: "Rapport Financier",  icon: FiDollarSign, desc: "Budget et dépenses" },
];

function getRapportUrl(type) {
  if (type === "journalier") {
    const today = new Date().toISOString().split("T")[0];
    return `/rapports/journalier/pdf?date=${today}`;
  }
  if (type === "mensuel") {
    const now = new Date();
    return `/rapports/mensuel/pdf?month=${now.getMonth() + 1}&year=${now.getFullYear()}`;
  }
  return `/rapports/${type}/pdf`;
}

export default function RapportButtons() {
  const generateRapport = async (type) => {
    try {
       const response = await api.get(getRapportUrl(type), { responseType: "blob" });
      const pdfUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Erreur génération rapport :", error);
      alert("Erreur lors de la génération du rapport");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
     {RAPPORTS.map(({ type, label, icon: Icon, desc }) => (
      <button
        key={type}
        onClick={() => generateRapport(type)}
        className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[var(--secondary)]/30 transition-all duration-200 text-left cursor-pointer group"
      >
        <div className="w-11 h-11 rounded-lg bg-[var(--secondary)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--secondary)]/20 transition-colors">
          <Icon size={20} className="text-[var(--secondary)]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--primary)]">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
        </div>
      </button>
))}
    </div>
  );
}