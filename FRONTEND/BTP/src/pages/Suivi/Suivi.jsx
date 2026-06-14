import React from "react";
import { Routes, Route } from "react-router-dom";
import SuiviListPage from "./SuiviListPage";
import AddSuiviPage from "./AddSuiviPage";
import EditSuiviPage from "./EditSuiviPage";

export default function Suivi() {
  return (
    <Routes>
      <Route path="/" element={<SuiviListPage />} />
      <Route path="/add" element={<AddSuiviPage />} />
      <Route path="/edit/:id" element={<EditSuiviPage />} />
    </Routes>
  );
}
