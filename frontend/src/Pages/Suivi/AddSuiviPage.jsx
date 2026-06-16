import "../../App.css";
import SuiviForm from "../../Components/suivi/SuiviForm";

export default function AddSuiviPage() {
  return (
    <div className="page-container">
      <h2 className="text-xl text-[var(--primary)] font-semibold"> État d'avancement du chantie </h2>
      <p className="mt-2">Remplissez le formulaire ci-dessous pour ajouter une mise à jour.</p>
      <div className="mt-2">
        <SuiviForm />
      </div>
    </div>
  );
}