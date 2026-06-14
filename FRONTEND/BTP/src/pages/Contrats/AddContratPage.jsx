import React from "react";
import ContratForm from "../../components/contrats/ContratForm";
import "../../App.css";

export default function AddContratPage() {
  return (
    <div className="page-container">
      <h2>➕ Nouveau Contrat</h2>
      <p>Ajoutez un nouveau contrat de construction</p>
      <ContratForm />
    </div>
  );
}
