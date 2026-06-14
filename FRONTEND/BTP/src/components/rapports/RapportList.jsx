import React from "react";
import RapportCard from "./RapportCard";
import "../../App.css";

export default function RapportList() {
  const rapportsRecents = [
    { type: "Rapport Mensuel", date: "2026-06-01" },
    { type: "Avancement Projets", date: "2026-05-15" }
  ];

  return (
    <div className="rapport-list">
      <h3>Rapports Récents</h3>
      <ul>
        {rapportsRecents.map((r, i) => (
          <RapportCard key={i} type={r.type} date={r.date} />
        ))}
      </ul>
    </div>
  );
}
