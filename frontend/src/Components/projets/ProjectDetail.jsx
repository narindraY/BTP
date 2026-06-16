import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiLoader, FiChevronLeft, FiPlus, FiCamera, FiMessageSquare, FiClock, FiCalendar } from 'react-icons/fi';
import { base_url } from '../../Utils/IP';
import ResourceTable from '../ressources/RessourceTable';
import ResourceForm from '../ressources/RessourceForm';

const TABS = ["Résumé", "Tâches", "Avancement", "Photos", "Suivi", "Rapports", "Ressources"];

const STATUT_CFG = {
  "Terminé":     { bg: "rgba(70,231,137,0.15)",  text: "var(--hoover)"    },
  "En cours":    { bg: "rgba(12,122,196,0.10)",   text: "var(--secondary)" },
  "Non démarré": { bg: "rgba(6,11,39,0.07)",      text: "var(--primary)"   },
  "En attente":  { bg: "rgba(245,159,9,0.12)",    text: "#f59e0b"          },
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";

const SuiviModal = ({ taches, projetId, onClose, onSaved }) => {
  const [form, setForm]     = useState({ tache_id: taches[0]?.id_tache || '', avancement: 0, commentaire: '', photo: null, photoPreview: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setForm(p => ({
        ...p,
        photo: file,
        photoPreview: file ? URL.createObjectURL(file) : '',
      }));
    } else if (name === "avancement") {
      setForm(p => ({ ...p, avancement: Number(value) }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      data.append("tache_id", form.tache_id);
      data.append("avancement", form.avancement);
      data.append("commentaire", form.commentaire);
      if (form.photo) data.append("file", form.photo);

      await axios.post(`${base_url}/projects/create/suivis`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSaved();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1060] flex items-center justify-center p-4"
      style={{ background: "rgba(6,11,39,0.50)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex flex-col w-full"
        style={{
          maxWidth: 560,
          background:    "var(--bg)",
          borderRadius:  16,
          border:        "0.5px solid rgba(6,11,39,0.10)",
          boxShadow:     "0 24px 64px rgba(6,11,39,0.20)",
          overflow:      "hidden",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "0.5px solid rgba(6,11,39,0.08)" }}
        >
          <h5 className="text-[15px] font-semibold m-0" style={{ color: "var(--primary)" }}>
            Ajouter une mise à jour
          </h5>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 hover:bg-[rgba(6,11,39,0.06)]"
            style={{ border: "0.5px solid rgba(6,11,39,0.10)", color: "rgba(6,11,39,0.4)" }}
          >
            <FiX size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold" style={{ color: "var(--primary)" }}>Tâche</label>
            <div className="relative">
              <select
                name="tache_id"
                value={form.tache_id}
                onChange={handleChange}
                required
                className="w-full text-[13px] rounded-lg px-3 py-2.5 pr-8 outline-none appearance-none bg-white transition-all duration-150 cursor-pointer"
                style={{ color: "var(--primary)", border: "1px solid rgba(6,11,39,0.14)" }}
              >
                {taches.map(t => <option key={t.id_tache} value={t.id_tache}>{t.nom_tache}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold" style={{ color: "var(--primary)" }}>
              Avancement : <span style={{ color: form.avancement >= 100 ? "var(--hoover)" : "var(--secondary)" }}>{form.avancement}%</span>
            </label>
            <input
              name="avancement"
              type="range" min="0" max="100" step="5"
              value={form.avancement}
              onChange={handleChange}
              className="w-full accent-[var(--secondary)]"
            />

            <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: "rgba(6,11,39,0.07)" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${form.avancement}%`,
                  background: form.avancement >= 100 ? "var(--hoover)" : "var(--secondary)",
                }}
              />
            </div>
            <div className="flex justify-between text-[11px]" style={{ color: "rgba(6,11,39,0.35)" }}>
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold" style={{ color: "var(--primary)" }}>Commentaire</label>
            <textarea
              name="commentaire"
              rows={3}
              placeholder="Observations, remarques…"
              value={form.commentaire}
              onChange={handleChange}
              className="w-full text-[13px] rounded-lg px-3 py-2.5 outline-none bg-white placeholder:text-gray-300 resize-none transition-all duration-150"
              style={{ color: "var(--primary)", border: "1px solid rgba(6,11,39,0.14)" }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold" style={{ color: "var(--primary)" }}>
              Photo <span style={{ color: "rgba(6,11,39,0.35)" }}>(optionnel)</span>
            </label>
            <label
              className="flex items-center gap-2.5 px-3 py-3 rounded-lg cursor-pointer transition-all duration-150 hover:bg-[rgba(12,122,196,0.04)]"
              style={{ border: "1px dashed rgba(6,11,39,0.18)", background: "rgba(6,11,39,0.02)" }}
            >
              <FiCamera size={16} style={{ color: "var(--secondary)" }} />
              <span className="text-[13px]" style={{ color: "rgba(6,11,39,0.45)" }}>
                {form.photo ? form.photo.name : "Cliquez pour ajouter une photo"}
              </span>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            {form.photoPreview && (
              <div className="mt-1 rounded-lg overflow-hidden" style={{ maxHeight: 140 }}>
                <img src={form.photoPreview} alt="Aperçu" className="w-full object-cover" style={{ maxHeight: 140 }} />
              </div>
            )}
          </div>

          <div
            className="flex items-center justify-end gap-2.5 pt-2"
            style={{ borderTop: "0.5px solid rgba(6,11,39,0.08)" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium rounded-lg transition-colors duration-150 hover:bg-[rgba(6,11,39,0.05)]"
              style={{ color: "rgba(6,11,39,0.5)", border: "0.5px solid rgba(6,11,39,0.12)" }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold rounded-lg text-white transition-all duration-150 disabled:opacity-50"
              style={{ background: "var(--secondary)" }}
            >
              {saving && <FiLoader size={13} className="animate-spin" />}
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatusBadge = ({ statut }) => {
  const cfg = STATUT_CFG[statut] ?? { bg: "rgba(6,11,39,0.07)", text: "var(--primary)" };
  return (
    <span
      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {statut || "—"}
    </span>
  );
};

const ProjectDetail = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState("Résumé");
  const [detail,    setDetail]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [suivis,    setSuivis]    = useState([]);
  const [loadingSuivis, setLoadingSuivis] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/projects/${project.id_projet}/detail`);
      const raw = res.data;
      setDetail(raw?.avancementGlobal !== undefined ? raw : raw?.data ?? raw);
    } catch (err) {
      console.error("Erreur détail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [project.id_projet]);

  const fetchSuivis = async () => {
    try {
      setLoadingSuivis(true);
      const res = await axios.get(`${base_url}/projects/${project.id_projet}/suivis`);
      setSuivis(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur chargement suivis:", err);
      setSuivis([]);
    } finally {
      setLoadingSuivis(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Suivi") fetchSuivis();
  }, [activeTab, project.id_projet]);

  const fmtDateTime = (d) => d
    ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

  if (loading) return (
    <div className="flex items-center justify-center gap-2 text-[13px]" style={{ height: "60vh", color: "rgba(6,11,39,0.4)" }}>
      <FiLoader size={16} className="animate-spin" />
      Chargement…
    </div>
  );

  const { avancementGlobal = 0, taches: rawTaches = [] } = detail || {};
  const taches = Array.isArray(rawTaches) ? rawTaches : [];

  return (
    <div className="px-6 py-6 w-full max-w-screen-lg mx-auto">

      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] font-semibold mb-4 transition-colors duration-150 hover:opacity-70"
        style={{ color: "var(--secondary)" }}
      >
        <FiChevronLeft size={15} />
        Retour aux projets
      </button>

      <div
        className="flex flex-col overflow-hidden"
        style={{
          maxWidth:     720,
          background:   "var(--bg)",
          borderRadius: 16,
          border:       "0.5px solid rgba(6,11,39,0.10)",
          boxShadow:    "0 2px 12px rgba(6,11,39,0.07)",
        }}
      >
        <div className="px-6 pt-5 pb-0" style={{ borderBottom: "0.5px solid rgba(6,11,39,0.08)" }}>
          <h5 className="text-[16px] font-bold mb-4" style={{ color: "var(--primary)" }}>
            {project.nom_projet}
          </h5>

          <div className="flex gap-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-2 text-[13px] font-semibold transition-all duration-150"
                style={{
                  color:        activeTab === tab ? "var(--secondary)" : "rgba(6,11,39,0.4)",
                  borderBottom: activeTab === tab ? "2px solid var(--secondary)" : "2px solid transparent",
                  background:   "transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">

          {activeTab === "Résumé" && (
            <div className="flex flex-col gap-5">

              <div>
                <p className="text-[12px] font-semibold mb-2" style={{ color: "rgba(6,11,39,0.5)" }}>Avancement global</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: 10, background: "rgba(6,11,39,0.07)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(avancementGlobal, 100)}%`, background: "var(--secondary)" }}
                    />
                  </div>
                  <span className="text-[14px] font-bold tabular-nums" style={{ minWidth: 38, color: "var(--secondary)" }}>
                    {avancementGlobal}%
                  </span>
                </div>
              </div>

              {taches.length === 0 ? (
                <p className="text-center text-[13px] py-6" style={{ color: "rgba(6,11,39,0.35)" }}>Aucune tâche enregistrée.</p>
              ) : (
                <div className="flex flex-col">
                  {taches.map((t, i) => (
                    <div key={t.id_tache} className="flex gap-3" style={{ paddingBottom: i < taches.length - 1 ? 18 : 0 }}>

                      <div className="flex flex-col items-center">
                        <div className="rounded-full shrink-0 mt-1" style={{ width: 10, height: 10, background: "var(--secondary)", border: "2px solid rgba(12,122,196,0.25)" }} />
                        {i < taches.length - 1 && (
                          <div className="flex-1 mt-1" style={{ width: 2, background: "rgba(6,11,39,0.08)" }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="text-[12px] mb-1" style={{ color: "rgba(6,11,39,0.4)" }}>{fmtDate(t.date_debut)}</div>
                            <div className="text-[14px] font-semibold" style={{ color: "var(--primary)" }}>{t.nom_tache}</div>
                            {t.responsable && (
                              <div className="text-[12px] mt-1" style={{ color: "rgba(6,11,39,0.4)" }}>Par : {t.responsable}</div>
                            )}
                          </div>
                          <StatusBadge statut={t.statut} />
                        </div>
                        {t.photo_url && (
                          <img src={t.photo_url} alt={t.nom_tache} className="mt-2 rounded-lg" style={{ width: 90, height: 60, objectFit: "cover" }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Tâches" && (
            <div className="w-full overflow-x-auto rounded-xl" style={{ border: "0.5px solid rgba(6,11,39,0.09)" }}>
              <table className="w-full border-collapse" style={{ fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "rgba(6,11,39,0.03)", borderBottom: "0.5px solid rgba(6,11,39,0.09)" }}>
                    {["Tâche", "Début", "Fin", "Avancement", "Statut"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(6,11,39,0.45)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {taches.map((t, idx) => (
                    <tr
                      key={t.id_tache}
                      style={{ borderBottom: idx < taches.length - 1 ? "0.5px solid rgba(6,11,39,0.07)" : "none" }}
                      className="hover:bg-[rgba(12,122,196,0.02)] transition-colors duration-100"
                    >
                      <td className="px-4 py-3 font-semibold" style={{ color: "var(--primary)" }}>{t.nom_tache}</td>
                      <td className="px-4 py-3" style={{ color: "rgba(6,11,39,0.5)" }}>{fmtDate(t.date_debut)}</td>
                      <td className="px-4 py-3" style={{ color: "rgba(6,11,39,0.5)" }}>{fmtDate(t.date_fin)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full overflow-hidden" style={{ width: 60, height: 6, background: "rgba(6,11,39,0.07)" }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.min(t.avancement || 0, 100)}%`, background: "var(--secondary)" }} />
                          </div>
                          <span className="text-[12px] font-semibold tabular-nums" style={{ color: "var(--secondary)" }}>
                            {t.avancement || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge statut={t.statut} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Avancement" && (
            <div className="flex flex-col gap-3">
              <p className="text-[13px] font-semibold m-0" style={{ color: "var(--primary)" }}>Avancement par tâche</p>
              {taches.map(t => (
                <div key={t.id_tache}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px]" style={{ color: "var(--primary)" }}>{t.nom_tache}</span>
                    <span className="text-[13px] font-bold tabular-nums" style={{ color: "var(--secondary)" }}>{t.avancement || 0}%</span>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: 8, background: "rgba(6,11,39,0.07)" }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(t.avancement || 0, 100)}%`, background: "var(--secondary)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Photos" && (
            <div className="grid grid-cols-3 gap-2">
              {taches.filter(t => t.photo_url).length === 0 ? (
                <p className="col-span-3 text-center text-[13px] py-6" style={{ color: "rgba(6,11,39,0.35)" }}>Aucune photo disponible.</p>
              ) : taches.filter(t => t.photo_url).map(t => (
                <div key={t.id_tache}>
                  <img src={t.photo_url} alt={t.nom_tache} className="w-full rounded-lg" style={{ height: 100, objectFit: "cover" }} />
                  <p className="text-[11px] mt-1 m-0" style={{ color: "rgba(6,11,39,0.45)" }}>{t.nom_tache}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Suivi" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold m-0" style={{ color: "var(--primary)" }}>
                  Historique des mises à jour
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg text-white transition-all duration-150 hover:opacity-85"
                  style={{ background: "var(--secondary)" }}
                >
                  <FiPlus size={14} />
                  Nouveau suivi
                </button>
              </div>

              {loadingSuivis ? (
                <div className="flex items-center justify-center gap-2 py-12 text-[13px]" style={{ color: "rgba(6,11,39,0.4)" }}>
                  <FiLoader size={16} className="animate-spin" />
                  Chargement…
                </div>
              ) : suivis.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(12,122,196,0.08)" }}>
                    <FiClock size={18} style={{ color: "var(--secondary)" }} />
                  </div>
                  <p className="text-[13px] m-0" style={{ color: "rgba(6,11,39,0.35)" }}>Aucune mise à jour enregistrée.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {suivis.map((s) => {
                    const barColor = s.avancement >= 100 ? "var(--hoover)" : s.avancement >= 50 ? "var(--secondary)" : "#f59e0b";
                    return (
                      <div
                        key={s.id_suivi}
                        className="flex flex-col rounded-xl overflow-hidden transition-all duration-150"
                        style={{
                          border: "0.5px solid rgba(6,11,39,0.09)",
                          background: "white",
                        }}
                      >
                        <div className="flex items-start gap-3 p-4">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-[12px] font-bold"
                            style={{ background: barColor }}
                          >
                            {s.avancement}%
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[13px] font-semibold truncate" style={{ color: "var(--primary)" }}>
                                {s.nom_tache}
                              </span>
                              <span className="text-[11px] shrink-0" style={{ color: "rgba(6,11,39,0.4)" }}>
                                <FiCalendar size={11} className="inline mr-1" />
                                {fmtDateTime(s.created_at)}
                              </span>
                            </div>
                            <div className="w-full rounded-full overflow-hidden mb-2" style={{ height: 5, background: "rgba(6,11,39,0.07)" }}>
                              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(s.avancement, 100)}%`, background: barColor }} />
                            </div>
                            {s.commentaire && (
                              <div className="flex items-start gap-1.5 mt-1">
                                <FiMessageSquare size={12} className="mt-0.5 shrink-0" style={{ color: "rgba(6,11,39,0.3)" }} />
                                <p className="text-[12px] m-0 leading-relaxed" style={{ color: "rgba(6,11,39,0.6)" }}>
                                  {s.commentaire}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        {s.photo && (
                          <div className="px-4 pb-3">
                            <div className="rounded-lg overflow-hidden" style={{ maxHeight: 160 }}>
                              <img
                                src={`http://localhost:3000${s.photo}`}
                                alt="Photo suivi"
                                className="w-full object-cover"
                                style={{ maxHeight: 160 }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "Rapports" && (
            <p className="text-center text-[13px] py-6" style={{ color: "rgba(6,11,39,0.35)" }}>
              Les rapports seront disponibles prochainement.
            </p>
          )}

          {activeTab === "Ressources" && <RessourcesTab projectId={project.id_projet} />}
        </div>
      </div>

      {showModal && taches.length > 0 && (
        <SuiviModal
          taches={taches}
          projetId={project.id_projet}
          onClose={() => setShowModal(false)}
          onSaved={() => { fetchDetail(); fetchSuivis(); }}
        />
      )}
    </div>
  );
};

const RESSOURCE_TABS = [
  { label: "Matériaux",     value: "Matériau" },
  { label: "Main-d'œuvre", value: "Main-d'œuvre" },
  { label: "Équipements",  value: "Équipement" },
];

const RessourcesTab = ({ projectId }) => {
  const [resources, setResources]         = useState([]);
  const [activeTab, setActiveTab]         = useState("Matériau");
  const [showModal, setShowModal]         = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [loading, setLoading]             = useState(false);

  const fetchResources = async (type = activeTab) => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/ressource/getall?type=${encodeURIComponent(type)}&projet_id=${projectId}`);
      setResources(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur fetch ressources:", err);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(activeTab); }, [activeTab, projectId]);

  const handleOpenAdd  = () => { setCurrentResource(null); setShowModal(true); };
  const handleOpenEdit = (resource) => { setCurrentResource(resource); setShowModal(true); };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette ressource ?")) return;
    try {
      await axios.delete(`${base_url}/ressource/delete/${id}`);
      fetchResources(activeTab);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  const handleSave = async (formData) => {
    try {
      const payload = { ...formData, type_ressource: activeTab, projet_id: projectId };
      if (currentResource) {
        await axios.put(`${base_url}/ressource/update/${currentResource.id_ressource}`, payload);
      } else {
        await axios.post(`${base_url}/ressource/create`, payload);
      }
      setShowModal(false);
      fetchResources(activeTab);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la sauvegarde.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold m-0" style={{ color: "var(--primary)" }}>
          Ressources du projet
        </p>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg text-white transition-all duration-150 hover:opacity-85"
          style={{ background: "var(--secondary)" }}
        >
          <FiPlus size={14} />
          Ajouter
        </button>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {RESSOURCE_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className="px-3 py-2 text-[12px] font-semibold transition-all duration-150"
            style={{
              color:        activeTab === tab.value ? "var(--secondary)" : "rgba(6,11,39,0.4)",
              borderBottom: activeTab === tab.value ? "2px solid var(--secondary)" : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ResourceTable
        resources={resources}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <ResourceForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSubmit={handleSave}
        initialData={currentResource}
        activeType={activeTab}
      />
    </div>
  );
};

export default ProjectDetail;