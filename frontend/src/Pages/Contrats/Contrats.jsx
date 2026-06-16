import { Routes, Route } from "react-router-dom";
import ContratListPage from "./ContratListPage";
import AddContratPage from "./AddContratPage";
import EditContratPage from "./EditContratPage";

export default function Contrats() {
  return (
    <Routes>
      <Route path="/" element={<ContratListPage />} />
      <Route path="/add" element={<AddContratPage />} />
      <Route path="/edit/:id" element={<EditContratPage />} />
    </Routes>
  );
}