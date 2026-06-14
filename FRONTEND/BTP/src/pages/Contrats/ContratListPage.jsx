import React from "react";
import ContratList from "../../components/contrats/ContratList";
import "../../App.css";

export default function ContratListPage() {
  return (
    <div className="page-container">
      <h2>Gestion des Contrats</h2>
      <p>Gérez tous vos contrats de construction</p>
      <ContratList />
    </div>
  );
}
