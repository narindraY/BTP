import "../../App.css";
import RapportButtons from "../../Components/rapports/RapportButtons";
import RapportList from "../../Components/rapports/RapportList";

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