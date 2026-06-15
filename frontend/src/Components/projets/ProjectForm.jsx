import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiAlertCircle, FiLoader, FiCalendar, FiDollarSign, FiFileText } from 'react-icons/fi';

const API = "http://localhost:3000/api";
const TYPES_PROJET = ["Bâtiment", "Route", "Pont", "Infrastructure", "Autre"];

const Label = ({ children, required }) => (
  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#060b27" }}>
    {children}
    {required && <span className="ml-0.5" style={{ color: "#f50909" }}>*</span>}
  </label>
);

const inputClass = `
  w-full text-[13px] rounded-lg px-3 py-2 outline-none transition-all duration-150
  border border-[rgba(6,11,39,0.12)] bg-white
  focus:border-[#0c7ac4] focus:ring-2 focus:ring-[#0c7ac4]/10
  placeholder:text-gray-300
`;

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
      const res  = await axios.get(`${API}/get/contrats`);
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
      await axios.post(`${API}/create/projects`, formData);
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,11,39,0.45)" }}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="w-full max-w-lg flex flex-col max-h-[90vh] rounded-2xl overflow-hidden"
        style={{ background: "#fff", border: "0.5px solid rgba(6,11,39,0.1)", boxShadow: "0 20px 60px rgba(6,11,39,0.2)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "0.5px solid rgba(6,11,39,0.08)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#0c7ac4" }}>
              <FiFileText size={14} color="#fff" />
            </div>
            <h5 className="text-[15px] font-semibold m-0" style={{ color: "#060b27" }}>Nouveau projet</h5>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150 hover:bg-[rgba(6,11,39,0.06)]"
            style={{ border: "0.5px solid rgba(6,11,39,0.1)", color: "#9ca3af" }}
          >
            <FiX size={15} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 px-5 py-4">

            {/* Erreur */}
            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium"
                style={{ background: "rgba(245,9,9,0.06)", color: "#f50909", border: "0.5px solid rgba(245,9,9,0.2)" }}
              >
                <FiAlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Contrat */}
            <div>
              <Label required>Contrat</Label>
              {loading ? (
                <div className="flex items-center gap-2 text-[12px]" style={{ color: "#9ca3af" }}>
                  <FiLoader size={13} className="animate-spin" />
                  Chargement des contrats…
                </div>
              ) : (
                <select name="contrat_id" value={formData.contrat_id} onChange={handleChange} required className={inputClass} style={{ color: formData.contrat_id ? "#060b27" : "#9ca3af" }}>
                  <option value="">— Choisir un contrat —</option>
                  {contrats.map(c => (
                    <option key={c.id_contrat} value={c.id_contrat} style={{ color: "#060b27" }}>
                      #{c.id_contrat} — {c.type_contrat} | {c.client} | {Number(c.budget).toLocaleString("fr-FR")} F
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Aperçu contrat sélectionné */}
            {selectedContrat && (
              <div
                className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-[12px]"
                style={{ background: "rgba(12,122,196,0.06)", border: "0.5px solid rgba(12,122,196,0.2)" }}
              >
                <span className="flex items-center gap-1.5 font-semibold" style={{ color: "#0c7ac4" }}>
                  <FiDollarSign size={13} />
                  {Number(selectedContrat.budget).toLocaleString("fr-FR")} F CFA
                </span>
                <span className="flex items-center gap-1.5" style={{ color: "#6b7280" }}>
                  <FiCalendar size={12} />
                  {selectedContrat.date_debut ? new Date(selectedContrat.date_debut).toLocaleDateString("fr-FR") : "—"}
                  {" → "}
                  {selectedContrat.date_fin ? new Date(selectedContrat.date_fin).toLocaleDateString("fr-FR") : "—"}
                </span>
              </div>
            )}

            {/* Nom projet */}
            <div>
              <Label required>Nom du projet</Label>
              <input
                type="text" name="nom_projet" value={formData.nom_projet}
                onChange={handleChange} required className={inputClass}
                placeholder="Ex : Construction Pont sur Comoé"
                style={{ color: "#060b27" }}
              />
            </div>

            {/* Type + Statut */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>Type de projet</Label>
                <select name="type_projet" value={formData.type_projet} onChange={handleChange} required className={inputClass} style={{ color: "#060b27" }}>
                  {TYPES_PROJET.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label>Statut initial</Label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClass} style={{ color: "#060b27" }}>
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description (optionnelle)</Label>
              <textarea
                name="description" value={formData.description} onChange={handleChange}
                rows={3} className={inputClass} placeholder="Détails du projet…"
                style={{ color: "#060b27", resize: "none" }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-2 px-5 py-3 shrink-0"
            style={{ borderTop: "0.5px solid rgba(6,11,39,0.08)" }}
          >
            <button
              type="button" onClick={handleClose}
              className="px-4 py-2 text-[13px] font-medium rounded-lg transition-colors duration-150 hover:bg-[rgba(6,11,39,0.05)]"
              style={{ color: "#6b7280", border: "0.5px solid rgba(6,11,39,0.12)" }}
            >
              Annuler
            </button>
            <button
              type="submit" disabled={saving || loading}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-lg text-white transition-opacity duration-150 disabled:opacity-50"
              style={{ background: saving || loading ? "#0c7ac4aa" : "#0c7ac4" }}
            >
              {saving && <FiLoader size={13} className="animate-spin" />}
              {saving ? "Création…" : "Créer le projet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;