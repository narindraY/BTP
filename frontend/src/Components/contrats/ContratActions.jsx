import { FaPlus } from "react-icons/fa";

export default function ContratActions({ onAdd, onSearch }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <input
        type="text"
        placeholder="Rechercher un contrat…"
        onChange={(e) => onSearch(e.target.value)}
        className="w-72 px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
      />
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] cursor-pointer active:scale-95 text-white text-sm font-semibold rounded-lg transition-all hover:bg-[var(--hoover)] hover:text-[var(--primary)]"
      >
        <span className="text-base leading-none"> <FaPlus size={18}/> </span>
        <p>Nouveau contrat</p>
      </button>
    </div>
  );
}