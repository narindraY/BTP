import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCards from '../../components/dashboard/StatCards';
import ProgressChart from '../../components/dashboard/ProgressChart';

const API = "http://localhost:5000/api";

const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("fr-FR");
};

const StatusBadge = ({ status }) => {
  const cls = {
    "En cours":   "bg-success-subtle text-success",
    "Terminé":    "bg-primary-subtle text-primary",
    "En attente": "bg-warning-subtle text-warning",
  }[status] || "bg-secondary-subtle text-secondary";
  return (
    <span className={`badge rounded-pill fw-semibold ${cls}`} style={{ fontSize: "11px" }}>
      {status || "—"}
    </span>
  );
};

const MiniProgress = ({ value = 0 }) => (
  <div className="d-flex align-items-center gap-2">
    <div className="progress" style={{ height: "8px", width: "80px", borderRadius: "99px" }}>
      <div
        className="progress-bar bg-primary"
        role="progressbar"
        style={{ width: `${Math.min(Math.round(value || 0), 100)}%`, borderRadius: "99px", transition: "width 0.6s ease" }}
      />
    </div>
    <span className="fw-semibold" style={{ fontSize: "13px" }}>{Math.round(value || 0)}%</span>
  </div>
);

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({ totalContrats: 0, projetsActifs: 0, budgetTotal: 0, avancementMoyen: 0 });
  const [recentProjets, setRecentProjets]   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsRes = await axios.get(`${API}/dashboard/stats`);
      setDashboardStats(statsRes.data);
      const projRes = await axios.get(`${API}/projects`);
      const projList = Array.isArray(projRes.data)
        ? projRes.data
        : projRes.data?.data ?? projRes.data?.projects ?? [];
      setRecentProjets(projList.slice(0, 5));
    } catch (err) {
      console.error("Erreur dashboard:", err);
      setError("Impossible de charger les données. Vérifiez que le serveur est démarré.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: "60vh" }}>
      <div className="spinner-border text-primary me-2" role="status" />
      <span className="text-muted">Chargement du tableau de bord…</span>
    </div>
  );

  if (error) return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3" style={{ height: "60vh" }}>
      <span className="text-danger" style={{ fontSize: "15px" }}>{error}</span>
      <button className="btn btn-primary" onClick={fetchDashboardData}>Réessayer</button>
    </div>
  );

  return (
    <div className="container-fluid py-4">

      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 fw-bold text-dark mb-0">Tableau de bord</h1>
        <button className="btn btn-light border fw-semibold d-flex align-items-center gap-2" onClick={fetchDashboardData}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
          </svg>
          Actualiser
        </button>
      </div>

      <StatCards stats={dashboardStats} />

      <ProgressChart projects={recentProjets} />

      <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
        <div className="card-header bg-white border-bottom fw-bold" style={{ fontSize: "15px" }}>
          Projets récents
        </div>
        {recentProjets.length === 0 ? (
          <div className="card-body text-center text-muted py-5" style={{ fontSize: "14px" }}>
            Aucun projet trouvé
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "13.5px" }}>
              <thead className="table-light">
                <tr>
                  {["Projet", "Type", "Budget alloué (FCFA)", "Début contrat", "Fin contrat", "Avancement", "Statut"].map(h => (
                    <th key={h} className="fw-semibold text-muted border-0 text-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentProjets.map((p, i) => (
                  <tr key={p.id_projet || i}>
                    <td className="fw-semibold text-dark">{p.nom_projet}</td>
                    <td className="text-secondary">{p.type_projet}</td>
                    <td className="text-secondary">{Number(p.budget_alloue || 0).toLocaleString("fr-FR")}</td>
                    <td className="text-muted">{fmtDate(p.contrat_debut)}</td>
                    <td className="text-muted">{fmtDate(p.contrat_fin)}</td>
                    <td><MiniProgress value={p.avancement_moyen ?? 0} /></td>
                    <td><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;