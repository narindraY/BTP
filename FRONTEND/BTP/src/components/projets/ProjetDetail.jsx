import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = "http://localhost:5000/api";
const TABS = ["Résumé", "Tâches", "Avancement", "Photos", "Rapports"];

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

const SuiviModal = ({ taches, projetId, onClose, onSaved }) => {
  const [form, setForm] = useState({ tache_id: taches[0]?.id_tache || '', avancement: 0, commentaire: '', photo: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.post(`${API}/projects/${projetId}/suivi`, form);
      onSaved();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow" style={{ borderRadius: "16px" }}>

          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">Ajouter une mise à jour</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">

              <div className="mb-3">
                <label className="form-label fw-semibold">Tâche</label>
                <select className="form-select" value={form.tache_id} onChange={e => setForm(p => ({ ...p, tache_id: e.target.value }))} required>
                  {taches.map(t => <option key={t.id_tache} value={t.id_tache}>{t.nom_tache}</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Avancement : <strong>{form.avancement}%</strong></label>
                <input type="range" className="form-range" min="0" max="100" step="5"
                  value={form.avancement} onChange={e => setForm(p => ({ ...p, avancement: Number(e.target.value) }))} />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Commentaire</label>
                <textarea className="form-control" rows={3} placeholder="Observations, remarques…"
                  value={form.commentaire} onChange={e => setForm(p => ({ ...p, commentaire: e.target.value }))} />
              </div>

              <div className="mb-1">
                <label className="form-label fw-semibold">Lien photo (optionnel)</label>
                <input type="text" className="form-control" placeholder="https://…"
                  value={form.photo} onChange={e => setForm(p => ({ ...p, photo: e.target.value }))} />
              </div>
            </div>

            <div className="modal-footer border-top">
              <button type="button" className="btn btn-light" onClick={onClose}>Annuler</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProjectDetail = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState("Résumé");
  const [detail, setDetail]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/projects/${project.id_projet}/detail`);
      setDetail(res.data);
    } catch (err) {
      console.error("Erreur détail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [project.id_projet]);

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: "60vh" }}>
      <div className="spinner-border text-primary me-2" role="status" />
      <span className="text-muted">Chargement…</span>
    </div>
  );

  const { avancementGlobal = 0, taches = [] } = detail || {};

  return (
    <div className="container-fluid py-4">

      <button className="btn btn-link text-primary fw-semibold ps-0 mb-3" onClick={onBack}>
        ← Retour aux projets
      </button>

      <div className="card border-0 shadow-sm" style={{ borderRadius: "16px", maxWidth: "720px" }}>

        <div className="card-body p-0">
          <div className="px-4 pt-4 pb-0">
            <h5 className="fw-bold mb-3">Projet : {project.nom_projet}</h5>

            <ul className="nav nav-tabs border-bottom">
              {TABS.map(tab => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link fw-semibold border-0 ${activeTab === tab ? "active text-primary" : "text-muted"}`}
                    onClick={() => setActiveTab(tab)}
                    style={{ fontSize: "13px" }}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4">

            {activeTab === "Résumé" && (
              <>
                <div className="mb-4">
                  <p className="fw-semibold mb-2" style={{ fontSize: "13px" }}>Avancement global</p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="progress flex-grow-1" style={{ height: "10px", borderRadius: "99px" }}>
                      <div className="progress-bar bg-primary" role="progressbar"
                        style={{ width: `${Math.min(avancementGlobal, 100)}%`, borderRadius: "99px", transition: "width 0.6s ease" }} />
                    </div>
                    <span className="fw-bold" style={{ minWidth: "38px", fontSize: "14px" }}>{avancementGlobal}%</span>
                  </div>
                </div>

                {taches.length === 0 ? (
                  <p className="text-muted text-center py-4" style={{ fontSize: "13px" }}>Aucune tâche enregistrée.</p>
                ) : (
                  <div>
                    {taches.map((t, i) => {
                      const badgeClass = STATUT_BADGE[t.statut] || "bg-secondary-subtle text-secondary";
                      return (
                        <div key={t.id_tache} className="d-flex gap-3" style={{ paddingBottom: i < taches.length - 1 ? "18px" : "0" }}>
                          <div className="d-flex flex-column align-items-center">
                            <div className="rounded-circle bg-primary border border-2 border-primary-subtle flex-shrink-0" style={{ width: "10px", height: "10px", marginTop: "3px" }} />
                            {i < taches.length - 1 && <div className="bg-secondary-subtle flex-grow-1 mt-1" style={{ width: "2px" }} />}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start gap-2">
                              <div>
                                <div className="text-muted mb-1" style={{ fontSize: "12px" }}>{fmtDate(t.date_debut)}</div>
                                <div className="fw-semibold" style={{ fontSize: "14px" }}>{t.nom_tache}</div>
                                {t.responsable && <div className="text-muted mt-1" style={{ fontSize: "12px" }}>Par : {t.responsable}</div>}
                              </div>
                              <span className={`badge rounded-pill fw-semibold flex-shrink-0 ${badgeClass}`} style={{ fontSize: "11px" }}>
                                {t.statut || "—"}
                              </span>
                            </div>
                            {t.photo_url && (
                              <img src={t.photo_url} alt={t.nom_tache} className="mt-2 rounded" style={{ width: "90px", height: "60px", objectFit: "cover" }} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === "Tâches" && (
              <div className="table-responsive">
                <table className="table table-hover align-middle" style={{ fontSize: "13px" }}>
                  <thead className="table-light">
                    <tr>
                      {["Tâche", "Début", "Fin", "Avancement", "Statut"].map(h => (
                        <th key={h} className="fw-semibold text-muted border-0">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {taches.map(t => {
                      const badgeClass = STATUT_BADGE[t.statut] || "bg-secondary-subtle text-secondary";
                      return (
                        <tr key={t.id_tache}>
                          <td className="fw-medium">{t.nom_tache}</td>
                          <td className="text-muted">{fmtDate(t.date_debut)}</td>
                          <td className="text-muted">{fmtDate(t.date_fin)}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress flex-grow-1" style={{ height: "6px", width: "60px" }}>
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "Avancement" && (
              <div>
                <p className="fw-semibold mb-3" style={{ fontSize: "13px" }}>Avancement par tâche</p>
                {taches.map(t => (
                  <div key={t.id_tache} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-dark">{t.nom_tache}</small>
                      <small className="fw-bold">{t.avancement || 0}%</small>
                    </div>
                    <div className="progress" style={{ height: "8px", borderRadius: "99px" }}>
                      <div className="progress-bar bg-primary" style={{ width: `${Math.min(t.avancement || 0, 100)}%`, borderRadius: "99px" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Photos" && (
              <div className="row g-2">
                {taches.filter(t => t.photo_url).length === 0 ? (
                  <p className="text-muted text-center py-4 col-12" style={{ fontSize: "13px" }}>Aucune photo disponible.</p>
                ) : taches.filter(t => t.photo_url).map(t => (
                  <div key={t.id_tache} className="col-4">
                    <img src={t.photo_url} alt={t.nom_tache} className="img-fluid rounded" style={{ height: "100px", width: "100%", objectFit: "cover" }} />
                    <small className="text-muted d-block mt-1">{t.nom_tache}</small>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Rapports" && (
              <p className="text-muted text-center py-4" style={{ fontSize: "13px" }}>Les rapports seront disponibles prochainement.</p>
            )}
          </div>

          <div className="px-4 pb-4">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Ajouter une mise à jour
            </button>
          </div>
        </div>
      </div>

      {showModal && taches.length > 0 && (
        <SuiviModal
          taches={taches}
          projetId={project.id_projet}
          onClose={() => setShowModal(false)}
          onSaved={fetchDetail}
        />
      )}
    </div>
  );
};

export default ProjectDetail;