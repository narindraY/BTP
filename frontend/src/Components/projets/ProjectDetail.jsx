import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiLoader, FiChevronLeft, FiPlus } from 'react-icons/fi';
import { base_url } from '../../Utils/IP';

const TABS = ["Résumé", "Tâches", "Avancement", "Photos", "Rapports"];

const STATUT_CFG = {
  "Terminé":     { bg: "rgba(70,231,137,0.15)",  text: "var(--hoover)"    },
  "En cours":    { bg: "rgba(12,122,196,0.10)",   text: "var(--secondary)" },
  "Non démarré": { bg: "rgba(6,11,39,0.07)",      text: "var(--primary)"   },
  "En attente":  { bg: "rgba(245,159,9,0.12)",    text: "#f59e0b"          },
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";

const SuiviModal = ({ taches, projetId, onClose, onSaved }) => {
  const [form, setForm]     = useState({ tache_id: taches[0]?.id_tache || '', avancement: 0, commentaire: '', photo: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.post(`${base_url}/projects/${projetId}/suivi`, form);
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
                value={form.tache_id}
                onChange={e => setForm(p => ({ ...p, tache_id: e.target.value }))}
                required
                className="w-full text-[13px] rounded-lg px-3 py-2.5 pr-8 outline-none appearance-none bg-white transition-all duration-150"
                style={{ color: "var(--primary)", border: "1px solid rgba(6,11,39,0.14)" }}
              >
                {taches.map(t => <option key={t.id_tache} value={t.id_tache}>{t.nom_tache}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold" style={{ color: "var(--primary)" }}>
              Avancement : <span style={{ color: "var(--secondary)" }}>{form.avancement}%</span>
            </label>
            <input
              type="range" min="0" max="100" step="5"
              value={form.avancement}
              onChange={e => setForm(p => ({ ...p, avancement: Number(e.target.value) }))}
              className="w-full accent-[var(--secondary)]"
            />

            <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: "rgba(6,11,39,0.07)" }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${form.avancement}%`, background: "var(--secondary)" }} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold" style={{ color: "var(--primary)" }}>Commentaire</label>
            <textarea
              rows={3}
              placeholder="Observations, remarques…"
              value={form.commentaire}
              onChange={e => setForm(p => ({ ...p, commentaire: e.target.value }))}
              className="w-full text-[13px] rounded-lg px-3 py-2.5 outline-none bg-white placeholder:text-gray-300 resize-none transition-all duration-150"
              style={{ color: "var(--primary)", border: "1px solid rgba(6,11,39,0.14)" }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold" style={{ color: "var(--primary)" }}>
              Lien photo <span style={{ color: "rgba(6,11,39,0.35)" }}>(optionnel)</span>
            </label>
            <input
              type="text"
              placeholder="https://…"
              value={form.photo}
              onChange={e => setForm(p => ({ ...p, photo: e.target.value }))}
              className="w-full text-[13px] rounded-lg px-3 py-2.5 outline-none bg-white placeholder:text-gray-300 transition-all duration-150"
              style={{ color: "var(--primary)", border: "1px solid rgba(6,11,39,0.14)" }}
            />
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

          {activeTab === "Rapports" && (
            <p className="text-center text-[13px] py-6" style={{ color: "rgba(6,11,39,0.35)" }}>
              Les rapports seront disponibles prochainement.
            </p>
          )}
        </div>

        <div className="px-6 pb-5" style={{ borderTop: "0.5px solid rgba(6,11,39,0.08)", paddingTop: 16 }}>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg text-white transition-opacity duration-150 hover:opacity-85"
            style={{ background: "var(--secondary)" }}
          >
            <FiPlus size={14} />
            Ajouter une mise à jour
          </button>
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