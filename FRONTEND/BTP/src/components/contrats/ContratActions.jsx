import React from "react";
import "../../App.css";

export default function ContratActions({ onAdd, onSearch }) {
  return (
    <div className="toolbar">
      <input type="text" placeholder="Recherche contrat..." onChange={(e) => onSearch(e.target.value)} />
      <button className="btn-primary" onClick={onAdd}>➕ Nouveau Contrat</button>
    </div>
  );
}
