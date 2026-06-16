import { FiCalendar, FiClock, FiDollarSign } from "react-icons/fi";
import api from "../../services/api";

const RAPPORTS = [
  { type: "journalier", label: "Rapport Journalier", icon: FiClock },
  { type: "mensuel",    label: "Rapport Mensuel",    icon: FiCalendar },
  { type: "financier",  label: "Rapport Financier",  icon: FiDollarSign },
];

function getRapportUrl(type) {
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
    <div className="flex gap-3 mt-5">
     {RAPPORTS.map(({ type, label, icon: Icon }) => (
  <button
    key={type}
    onClick={() => generateRapport(type)}
    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] cursor-pointer text-white rounded-lg font-semibold"
  >
    <Icon size={18} />
    {label}
  </button>
))}
    </div>
  );
}