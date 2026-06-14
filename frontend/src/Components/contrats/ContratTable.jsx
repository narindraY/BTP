import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

const fmtDate  = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";
const fmtBudget = (b) => `${Number(b || 0).toLocaleString("fr-FR")} FCFA`;

const COLS = ["Référence", "Client", "Type", "Budget", "Date début", "Date fin", "Description", "Actions"];

const ActionBtn = ({ icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
    style={{ background: `${color}12`, color, border: `0.5px solid ${color}30` }}
  >
    {icon}
  </button>
);

export default function ContratTable({ contrats, onView, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl" style={{ border: "0.5px solid rgba(6,11,39,0.1)" }}>
      <table className="w-full text-[13px] border-collapse">

        <thead>
          <tr style={{ borderBottom: "0.5px solid rgba(6,11,39,0.08)", background: "rgba(6,11,39,0.02)" }}>
            {COLS.map(col => (
              <th
                key={col}
                className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap"
                style={{ color: "rgba(6,11,39,0.4)" }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {contrats.map((c, i) => (
            <tr
              key={c.id_contrat}
              style={{
                borderBottom: i < contrats.length - 1 ? "0.5px solid rgba(6,11,39,0.06)" : "none",
                background: "var(--bg)",
              }}
            >
              <td className="px-4 py-3 font-semibold tabular-nums" style={{ color: "var(--secondary)" }}>
                CT-{c.id_contrat}
              </td>
              <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: "var(--primary)" }}>
                {c.client}
              </td>
              <td className="px-4 py-3">
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap"
                  style={{ background: "rgba(12,122,196,0.08)", color: "var(--secondary)" }}
                >
                  {c.type_contrat}
                </span>
              </td>
              <td className="px-4 py-3 font-semibold tabular-nums whitespace-nowrap" style={{ color: "var(--primary)" }}>
                {fmtBudget(c.budget)}
              </td>
              <td className="px-4 py-3 tabular-nums whitespace-nowrap" style={{ color: "rgba(6,11,39,0.5)" }}>
                {fmtDate(c.date_debut)}
              </td>
              <td className="px-4 py-3 tabular-nums whitespace-nowrap" style={{ color: "rgba(6,11,39,0.5)" }}>
                {fmtDate(c.date_fin)}
              </td>
              <td className="px-4 py-3 max-w-[180px]" style={{ color: "rgba(6,11,39,0.5)" }}>
                <span className="block truncate">{c.description || "—"}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <ActionBtn icon={<FiEye size={13} />}    color="var(--secondary)" onClick={() => onView(c)} />
                  <ActionBtn icon={<FiEdit2 size={13} />}  color="var(--primary)"   onClick={() => onEdit(c)} />
                  <ActionBtn icon={<FiTrash2 size={13} />} color="var(--error)"     onClick={() => onDelete(c.id_contrat)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}