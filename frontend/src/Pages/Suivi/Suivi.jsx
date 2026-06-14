import { Routes, Route } from "react-router-dom";
import AddSuiviPage from "./AddSuiviPage";
import EditSuiviPage from "./EditSuiviPage";
import SuiviListPage from "./SuiviListPage";

export default function Suivi() {
  return (
    <Routes>
      <Route path="/" element={<SuiviListPage />} />
      <Route path="/add" element={<AddSuiviPage />} />
      <Route path="/edit/:id" element={<EditSuiviPage />} />
    </Routes>
  );
}