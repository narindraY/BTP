import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = "http://localhost:5173/api";
const TYPES_PROJET = ["Bâtiment", "Route", "Pont", "Infrastructure", "Autre"];

const ProjectForm = ({ show, handleClose, onProjectCreated }) => {

  const emptyForm = { nom_projet: '', type_projet: 'Bâtiment', description: '', contrat_id: '', status: 'En attente' };

  const [formData, setFormData] = useState(emptyForm);
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!show) return;
    setFormData(emptyForm);
    setError(null);
    fetchContrats();
  }, [show]);

  const fetchContrats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/projects/contrats`);
      const list = Array.isArray(res.data) ? res.data : res.data?.data ?? res.data?.contrats ?? [];
      setContrats(list);
    } catch {
      setError("Impossible de charger les contrats.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.contrat_id) { setError("Veuillez sélectionner un contrat."); return; }
    try {
      setSaving(true);
      setError(null);
      await axios.post(`${API}/projects`, formData);
      handleClose();
      if (onProjectCreated) onProjectCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du projet.");
    } finally {
      setSaving(false);
    }
  };

  const selectedContrat = contrats.find(c => String(c.id_contrat) === String(formData.contrat_id));

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow" style={{ borderRadius: "16px" }}>

          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">Nouveau projet</h5>
            <button type="button" className="btn-close" onClick={handleClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">

              {error && (
                <div className="alert alert-danger py-2 px-3" style={{ fontSize: "13px" }}>{error}</div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Contrat <span className="text-danger">*</span>
                </label>
                {loading ? (
                  <div className="text-muted" style={{ fontSize: "13px" }}>Chargement des contrats…</div>
                ) : (
                  <select name="contrat_id" value={formData.contrat_id} onChange={handleChange} required className="form-select">
                    <option value="">— Choisir un contrat —</option>
                    {contrats.map(c => (
                      <option key={c.id_contrat} value={c.id_contrat}>
                        #{c.id_contrat} — {c.type_contrat} | {c.client} | {Number(c.budget).toLocaleString("fr-FR")} F
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Nom du projet <span className="text-danger">*</span>
                </label>
                <input
                  type="text" name="nom_projet" value={formData.nom_projet}
                  onChange={handleChange} required className="form-control"
                  placeholder="Ex: Construction Pont sur Comoé"
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold">
                    Type de projet <span className="text-danger">*</span>
                  </label>
                  <select name="type_projet" value={formData.type_projet} onChange={handleChange} required className="form-select">
                    {TYPES_PROJET.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">Statut initial</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Description (optionnelle)</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange}
                  rows={3} className="form-control" placeholder="Détails du projet…"
                />
              </div>

              {selectedContrat && (
                <div className="alert alert-primary py-2 px-3" style={{ fontSize: "13px" }}>
                  💰 Budget : <strong>{Number(selectedContrat.budget).toLocaleString("fr-FR")} F CFA</strong>
                  &nbsp;|&nbsp;
                  📅 {selectedContrat.date_debut ? new Date(selectedContrat.date_debut).toLocaleDateString("fr-FR") : "—"}
                  {" → "}
                  {selectedContrat.date_fin ? new Date(selectedContrat.date_fin).toLocaleDateString("fr-FR") : "—"}
                </div>
              )}
            </div>

            <div className="modal-footer border-top">
              <button type="button" className="btn btn-light" onClick={handleClose}>Annuler</button>
              <button type="submit" className="btn btn-primary" disabled={saving || loading}>
                {saving ? "Création…" : "Créer le projet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;