import React from 'react';

const STATUS_CFG = {
  "En cours":   { badge: "success" },
  "Terminé":    { badge: "primary" },
  "En attente": { badge: "warning" },
};

const TYPE_COLORS = {
  "Bâtiment": "#2563EB",
  "Route":    "#16A34A",
  "Pont":     "#D97706",
};

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR");
};

const ProjectCard = ({ project, onClick }) => {
  const { nom_projet, type_projet, status, budget_alloue, contrat_fin, avancement_moyen } = project;

  const statusCfg  = STATUS_CFG[status] || { badge: "secondary" };
  const typeColor  = TYPE_COLORS[type_projet] || "#6B7280";
  const avanc      = Math.round(avancement_moyen || 0);

  return (
    <div
      className="card border-0 shadow-sm h-100"
      style={{ borderRadius: 14, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", overflow: "hidden" }}
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
    >
      <div style={{ height: 4, background: typeColor }} />

      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="fw-bold mb-0 text-dark pe-2" style={{ fontSize: 15 }}>{nom_projet}</h6>
          <span className={`badge rounded-pill bg-${statusCfg.badge} bg-opacity-15 text-${statusCfg.badge} fw-semibold`} style={{ fontSize: 11, whiteSpace: "nowrap" }}>
            {status || "—"}
          </span>
        </div>

        <div className="mb-3">
          <span className="badge fw-semibold" style={{ background: typeColor + "20", color: typeColor, fontSize: 12 }}>
            {type_projet}
          </span>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Avancement</small>
            <small className="fw-bold text-dark">{avanc}%</small>
          </div>
          <div className="progress" style={{ height: 7, borderRadius: 99 }}>
            <div
              className={`progress-bar ${avanc >= 100 ? "bg-success" : "bg-primary"}`}
              style={{ width: `${Math.min(avanc, 100)}%`, borderRadius: 99, transition: "width 0.5s ease" }}
            />
          </div>
        </div>

        <div className="row g-2">
          <div className="col-6">
            <small className="text-muted d-block">Budget</small>
            <small className="fw-semibold text-dark">{Number(budget_alloue || 0).toLocaleString("fr-FR")} F</small>
          </div>
          <div className="col-6">
            <small className="text-muted d-block">Fin prévue</small>
            <small className="fw-semibold text-dark">{fmtDate(contrat_fin)}</small>
          </div>
        </div>
      </div>

      <div className="card-footer bg-white border-top text-center py-2" style={{ fontSize: 12, color: "#2563EB", fontWeight: 600 }}>
        Voir les détails →
      </div>
    </div>
  );
};

export default ProjectCard;