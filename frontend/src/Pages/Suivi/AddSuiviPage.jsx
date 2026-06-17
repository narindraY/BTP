import "../../App.css";
import SuiviForm from "../../Components/suivi/SuiviForm";
import SuiviListPage from "./SuiviListPage";

export default function AddSuiviPage() {
  return (
    <div className="page-container">
     <SuiviListPage/>
      <div className="mt-2">
        <SuiviForm />
      </div>
    </div>
  );
}