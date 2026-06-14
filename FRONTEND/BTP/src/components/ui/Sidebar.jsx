import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside style={{ width: "220px", background: "#2c3e50", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ marginBottom: "30px" }}>BTP-CONTRACT</h2>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}> TABLEAU DE BORD</Link>
          </li>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/contrats" style={{ color: "#fff", textDecoration: "none" }}> CONTRATS</Link>
          </li>
            <li style={{ marginBottom: "15px" }}>
           
            <Link to="/suivis" style={{ color: "#fff", textDecoration: "none" }}> SUIVI DE TRAVAIL</Link>
             </li>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/rapports" style={{ color: "#fff", textDecoration: "none" }}> RAPPORTS</Link>
          </li>
        
        </ul>
      </nav>
    </aside>
  );
}
