import React from "react";
import RapportButtons from "../../components/rapports/RapportButtons";
import RapportList from "../../components/rapports/RapportList";
import "../../App.css";

export default function Rapports() {
  return (
    <div className="page-container">
      <h2>Gestion des Rapports</h2>
      <p>Générez et téléchargez les rapports d’avancement</p>
      <RapportButtons />
      <RapportList />
    </div>
  );
}
