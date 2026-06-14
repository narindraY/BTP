import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/ui/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Contrats from "./pages/Contrats/Contrats";
import Rapports from "./pages/Rapports/Rapports";
import Suivi from "./pages/Suivi/Suivi";

export default function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "20px" }}>
          <Routes>
           
            <Route path="/" element={<Dashboard />} />

           
            <Route path="/contrats/*" element={<Contrats />} />

          
            <Route path="/rapports/*" element={<Rapports />} />

           
            <Route path="/suivis/*" element={<Suivi />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
