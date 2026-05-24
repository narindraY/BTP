import React from "react";

const IconContrat = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconProjet = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20M6 20V10l6-6 6 6v10"/>
    <path d="M10 20v-5h4v5"/>
  </svg>
);
const IconBudget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
    <line x1="12" y1="6" x2="12" y2="18"/>
  </svg>
);
const IconAvanc = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const CARDS = [
  { key: "totalContrats",  label: "Contrats",           icon: <IconContrat />, accent: "#2563EB", bgClass: "bg-primary bg-opacity-10", borderColor: "#2563EB", format: v => v },
  { key: "projetsActifs",  label: "Projets en cours",   icon: <IconProjet />,  accent: "#16A34A", bgClass: "bg-success bg-opacity-10", borderColor: "#16A34A", format: v => v },
  { key: "budgetTotal",    label: "Budget total (FCFA)", icon: <IconBudget />,  accent: "#D97706", bgClass: "bg-warning bg-opacity-10", borderColor: "#D97706", format: v => Number(v).toLocaleString("fr-FR") },
  { key: "avancementMoyen",label: "Avancement moyen",   icon: <IconAvanc />,   accent: "#7C3AED", bgClass: "bg-purple",                borderColor: "#7C3AED", format: v => `${Math.round(Number(v) || 0)} %` },
];

const StatCards = ({ stats = {} }) => (
  <div className="row g-3 mb-4">
    {CARDS.map(({ key, label, icon, accent, bgClass, borderColor, format }) => (
      <div key={key} className="col-xl-3 col-md-6">
        <div
          className={`card border-0 shadow-sm h-100 ${bgClass}`}
          style={{ borderLeft: `4px solid ${borderColor} !important`, borderRadius: "12px" }}
        >
          <div className="card-body d-flex justify-content-between align-items-start p-3">
            <div>
              <div
                className="fw-bold mb-1"
                style={{
                  fontSize: key === "budgetTotal" ? "17px" : "28px",
                  color: accent,
                  fontFamily: "monospace",
                }}
              >
                {format(stats[key] ?? 0)}
              </div>
              <div className="text-muted" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {label}
              </div>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 text-white flex-shrink-0"
              style={{ width: 44, height: 44, background: accent }}
            >
              {icon}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default StatCards;