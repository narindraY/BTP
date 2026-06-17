
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconDelete = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const ResourceTable = ({ resources = [], loading = false, onEdit, onDelete }) => {

  if (loading) return (
    <div className="flex items-center justify-center gap-2 py-12 text-[13px]" style={{ color: "rgba(6,11,39,0.4)" }}>
      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Chargement…
    </div>
  );

  const HEADERS = ["Ressource", "Unité", "Stock", "Prix unitaire", "Actions"];

  return (
    <div className="w-full overflow-x-auto rounded-xl" style={{ border: "0.5px solid rgba(6,11,39,0.09)" }}>
      <table className="w-full border-collapse" style={{ fontSize: 13 }}>
        <thead>
          <tr style={{ background: "rgba(6,11,39,0.03)", borderBottom: "0.5px solid rgba(6,11,39,0.09)" }}>
            {HEADERS.map(h => (
              <th
                key={h}
                className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "rgba(6,11,39,0.45)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-[13px]" style={{ color: "rgba(6,11,39,0.35)" }}>
                Aucune ressource trouvée.
              </td>
            </tr>
          ) : (
            resources.map((item, idx) => (
              <tr
                key={item.id_ressource}
                className="transition-colors duration-100"
                style={{
                  borderBottom:    idx < resources.length - 1 ? "0.5px solid rgba(6,11,39,0.07)" : "none",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(12,122,196,0.025)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td className="px-4 py-3 font-semibold" style={{ color: "var(--primary)" }}>
                  {item.nom_ressource}
                </td>
                <td className="px-4 py-3" style={{ color: "rgba(6,11,39,0.5)" }}>
                  {item.unite || "—"}
                </td>
                <td className="px-4 py-3 tabular-nums" style={{ color: "rgba(6,11,39,0.6)" }}>
                  {Number(item.quantite || 0).toLocaleString("fr-FR")}
                </td>
                <td className="px-4 py-3 tabular-nums font-medium" style={{ color: "var(--primary)" }}>
                  {Number(item.prix_unitaire || 0).toLocaleString("fr-FR")} F
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => onEdit(item)}
                      title="Modifier"
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
                      style={{ color: "rgba(6,11,39,0.4)", border: "0.5px solid rgba(6,11,39,0.10)" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color       = "var(--secondary)";
                        e.currentTarget.style.background  = "rgba(12,122,196,0.08)";
                        e.currentTarget.style.borderColor = "rgba(12,122,196,0.25)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color       = "rgba(6,11,39,0.4)";
                        e.currentTarget.style.background  = "transparent";
                        e.currentTarget.style.borderColor = "rgba(6,11,39,0.10)";
                      }}
                    >
                      <IconEdit />
                    </button>

                    <button
                      onClick={() => onDelete(item.id_ressource)}
                      title="Supprimer"
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
                      style={{ color: "rgba(6,11,39,0.4)", border: "0.5px solid rgba(6,11,39,0.10)" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color       = "var(--error)";
                        e.currentTarget.style.background  = "rgba(245,9,9,0.07)";
                        e.currentTarget.style.borderColor = "rgba(245,9,9,0.22)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color       = "rgba(6,11,39,0.4)";
                        e.currentTarget.style.background  = "transparent";
                        e.currentTarget.style.borderColor = "rgba(6,11,39,0.10)";
                      }}
                    >
                      <IconDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTable;