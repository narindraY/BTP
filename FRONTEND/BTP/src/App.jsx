import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Dashboard  from './pages/Dashboard/Dashboard';
import Ressources from './pages/Ressources/Ressources';
import Projets    from './pages/Projets/Projets';
import logo from './assets/logoBTP.png';
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const NAV_ITEMS = [
  { to: "/", label: "Tableau de bord", end: true,
    icon: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"] },
  { to: "/contrats", label: "Contrats",
    icon: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"] },
  { to: "/projets", label: "Projets",
    icon: ["M2 20h20", "M6 20V10l6-6 6 6v10", "M10 20v-5h4v5"] },
  { to: "/suivi", label: "Suivi des travaux",
    icon: ["M9 11l3 3L22 4", "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"] },
  { to: "/ressources", label: "Ressources",
    icon: ["M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z", "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"] },
  { to: "/finance", label: "Finance",
    icon: ["M12 1v22", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"] },
  { to: "/rapports", label: "Rapports",
    icon: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M8 13h8", "M8 17h5"] },
  { to: "/utilisateurs", label: "Utilisateurs",
    icon: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"] },
  { to: "/parametres", label: "Paramètres",
    icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" },
];

const ComingSoon = ({ title }) => (
  <div className="d-flex flex-column align-items-center justify-content-center gap-2" style={{ height: "60vh" }}>
    <div style={{ fontSize: "40px" }}>🚧</div>
    <h5 className="fw-bold text-dark">{title}</h5>
    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>Cette page est en cours de développement.</p>
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-wrapper">

      <nav className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <img src={logo} alt="Logo" style={{ width: 28, height: 28, objectFit: "contain" }} />
        </div>
        <span className="sidebar-logo-text">BuildManager</span>
      </div>

        <div className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end} className="sidebar-link">
              <span className="flex-shrink-0">
                <Icon d={item.icon} size={17} />
              </span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="main-wrapper">

        <header className="topbar shadow-sm">
          <button className="btn btn-link text-secondary p-1" onClick={() => setSidebarOpen(o => !o)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="ms-auto d-flex align-items-center gap-2">
            <button className="btn btn-link text-secondary p-2 position-relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="position-absolute top-0 end-0 bg-danger border border-white rounded-circle" style={{ width: "8px", height: "8px" }} />
            </button>

            <div className="d-flex align-items-center gap-2 px-2 py-1 rounded-3" style={{ cursor: "pointer" }}>
              <div className="avatar-circle">A</div>
              <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>Admin</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/projets"      element={<Projets />} />
            <Route path="/ressources"   element={<Ressources />} />
            <Route path="/contrats"     element={<ComingSoon title="Contrats" />} />
            <Route path="/suivi"        element={<ComingSoon title="Suivi des travaux" />} />
            <Route path="/finance"      element={<ComingSoon title="Finance" />} />
            <Route path="/rapports"     element={<ComingSoon title="Rapports" />} />
            <Route path="/utilisateurs" element={<ComingSoon title="Utilisateurs" />} />
            <Route path="/parametres"   element={<ComingSoon title="Paramètres" />} />
            <Route path="*"             element={<ComingSoon title="Page non trouvée" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;