import React from 'react';

const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconDelete = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const ResourceTable = ({ resources = [], loading = false, onEdit, onDelete }) => {

  if (loading) return (
    <div className="text-center text-muted py-5" style={{ fontSize: "13px" }}>
      <div className="spinner-border spinner-border-sm me-2" role="status" />
      Chargement…
    </div>
  );

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0" style={{ fontSize: "14px" }}>
        <thead className="table-light">
          <tr>
            <th className="fw-semibold border-0">Matériau</th>
            <th className="fw-semibold border-0">Unité</th>
            <th className="fw-semibold border-0">Stock</th>
            <th className="fw-semibold border-0">Prix unitaire</th>
            <th className="fw-semibold border-0">Action</th>
          </tr>
        </thead>
        <tbody>
          {resources.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-muted py-4" style={{ fontSize: "13px" }}>
                Aucune ressource trouvée.
              </td>
            </tr>
          ) : (
            resources.map(item => (
              <tr key={item.id_ressource}>
                <td className="fw-medium text-dark">{item.nom_ressource}</td>
                <td className="text-secondary">{item.unite || "—"}</td>
                <td className="text-secondary">{Number(item.quantite || 0).toLocaleString("fr-FR")}</td>
                <td className="text-secondary">{Number(item.prix_unitaire || 0).toLocaleString("fr-FR")}</td>
                <td>
                  <div className="d-flex gap-2 align-items-center">
                    <button
                      onClick={() => onEdit(item)}
                      title="Modifier"
                      className="btn btn-sm btn-light text-secondary p-1"
                      onMouseEnter={e => e.currentTarget.classList.replace("text-secondary", "text-primary")}
                      onMouseLeave={e => e.currentTarget.classList.replace("text-primary", "text-secondary")}
                    >
                      <IconEdit />
                    </button>
                    <button
                      onClick={() => onDelete(item.id_ressource)}
                      title="Supprimer"
                      className="btn btn-sm btn-light text-secondary p-1"
                      onMouseEnter={e => e.currentTarget.classList.replace("text-secondary", "text-danger")}
                      onMouseLeave={e => e.currentTarget.classList.replace("text-danger", "text-secondary")}
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