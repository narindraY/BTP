import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = "http://localhost:5000/api";

const STATUT_BADGE = {
  "Terminé":     "bg-success-subtle text-success",
  "En cours":    "bg-primary-subtle text-primary",
  "Non démarré": "bg-secondary-subtle text-secondary",
  "En attente":  "bg-warning-subtle text-warning",
};

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR");
};

const Taches = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjet, setSelectedProjet] = useState('');
  const [taches, setTaches]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [loadingProj, setLoadingProj] = useState(true);

  useEffect(() => {
    axios.get(`${API}/projects`)
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data ?? res.data?.projects ?? [];
        setProjects(list); setLoadingProj(false);
      })
      .catch(() => setLoadingProj(false));
  }, []);

  useEffect(() => {
    if (!selectedProjet) { setTaches([]); return; }
    setLoading(true);
    axios.get(`${API}/projects/${selectedProjet}/taches`)
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data ?? res.data?.taches ?? [];
        setTaches(list);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedProjet]);

  const toggleStatut = async (tache) => {
    const newStatut = tache.statut === 'Terminé' ? 'En cours' : 'Terminé';
    const avancement = newStatut === 'Terminé' ? 100 : 50;
    try {
      await axios.post(`${API}/projects/${selectedProjet}/suivi`, {
        tache_id: tache.id_tache,
        avancement,
        commentaire: `Statut changé en ${newStatut}`,
        photo: null,
      });
      const res = await axios.get(`${API}/projects/${selectedProjet}/taches`);
      setTaches(res.data);
    } catch (err) {
      console.error("Erreur toggle statut:", err);
    }
  };

  return (
    <div className="container-fluid py-4">

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h4 fw-bold text-dark mb-0">Tâches</h1>
          <p className="text-muted mb-0" style={{ fontSize: "13px" }}>Planning des tâches par projet</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "12px", maxWidth: "500px" }}>
        <div className="card-body p-3">
          <label className="form-label fw-semibold">Sélectionner un projet</label>
          {loadingProj ? (
            <div className="text-muted" style={{ fontSize: "13px" }}>Chargement des projets…</div>
          ) : (
            <select
              className="form-select"
              value={selectedProjet}
              onChange={e => setSelectedProjet(e.target.value)}
            >
              <option value="">— Choisir un projet —</option>
              {projects.map(p => (
                <option key={p.id_projet} value={p.id_projet}>{p.nom_projet}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {!selectedProjet ? (
        <div className="text-center text-muted py-5" style={{ fontSize: "14px" }}>
          Sélectionnez un projet pour voir ses tâches.
        </div>
      ) : loading ? (
        <div className="d-flex align-items-center justify-content-center py-5">
          <div className="spinner-border text-primary me-2" role="status" />
          <span className="text-muted">Chargement des tâches…</span>
        </div>
      ) : taches.length === 0 ? (
        <div className="text-center text-muted py-5" style={{ fontSize: "14px" }}>
          Aucune tâche pour ce projet.
        </div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "13.5px" }}>
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold text-muted border-0">Tâche</th>
                  <th className="fw-semibold text-muted border-0">Début</th>
                  <th className="fw-semibold text-muted border-0">Fin</th>
                  <th className="fw-semibold text-muted border-0">Avancement</th>
                  <th className="fw-semibold text-muted border-0">Statut</th>
                  <th className="fw-semibold text-muted border-0">Action</th>
                </tr>
              </thead>
              <tbody>
                {taches.map(t => {
                  const badgeClass = STATUT_BADGE[t.statut] || "bg-secondary-subtle text-secondary";
                  return (
                    <tr key={t.id_tache}>
                      <td className="fw-medium text-dark">{t.nom_tache}</td>
                      <td className="text-muted">{fmtDate(t.date_debut)}</td>
                      <td className="text-muted">{fmtDate(t.date_fin)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress" style={{ height: "6px", width: "60px" }}>
                            <div className="progress-bar bg-primary" style={{ width: `${Math.min(t.avancement || 0, 100)}%` }} />
                          </div>
                          <small>{t.avancement || 0}%</small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge rounded-pill fw-semibold ${badgeClass}`} style={{ fontSize: "11px" }}>
                          {t.statut || "—"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm fw-semibold ${t.statut === 'Terminé' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                          style={{ fontSize: "11px" }}
                          onClick={() => toggleStatut(t)}
                        >
                          {t.statut === 'Terminé' ? 'Rouvrir' : '✓ Terminer'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Taches;