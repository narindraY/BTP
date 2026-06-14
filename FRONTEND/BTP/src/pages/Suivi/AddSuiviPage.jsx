import React from "react";
import SuiviForm from "../../components/suivi/SuiviForm";
import "../../App.css";

export default function AddSuiviPage() {
  return (
    <div className="page-container">
      <h2>➕ Ajouter un Suivi</h2>
      <p>Remplissez le formulaire ci-dessous pour ajouter une mise à jour.</p>
      <SuiviForm />
    </div>
  );
}
