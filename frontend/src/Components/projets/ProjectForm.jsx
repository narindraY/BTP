import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiAlertCircle, FiLoader, FiCalendar, FiDollarSign, FiFileText, FiChevronDown } from 'react-icons/fi';

const API = "http://localhost:3000/api";
const TYPES_PROJET = ["Bâtiment", "Route", "Pont", "Infrastructure", "Autre"];

const validate = (formData) => {
  const errs = {};
  if (!formData.contrat_id)
    errs.contrat_id = "Veuillez sélectionner un contrat.";
  if (!formData.nom_projet.trim())
    errs.nom_projet = "Le nom du projet est obligatoire.";
  else if (formData.nom_projet.trim().length < 4)
    errs.nom_projet = "Le nom doit contenir au moins 4 caractères.";
  if (!formData.type_projet)
    errs.type_projet = "Veuillez choisir un type de projet.";
  return errs;
};

const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-[12px] font-semibold" style={{ color: "var(--primary)" }}>
      {label}
      {required && <span className="ml-0.5" style={{ color: "var(--error)" }}> *</span>}
    </label>
    {children}
    {error && (
      <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--error)" }}>
        <FiAlertCircle size={11} />
        {error}
      </span>
    )}
  </div>
);

const useFieldStyle = (hasError) => {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  const borderColor = hasError
    ? "var(--error)"
    : focus
    ? "var(--secondary)"
    : hover
    ? "rgba(12,122,196,0.45)"
    : "rgba(6,11,39,0.14)";

  const boxShadow = hasError
    ? "0 0 0 3px rgba(245,9,9,0.10)"
    : focus
    ? "0 0 0 3px rgba(12,122,196,0.13)"
    : "none";

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus:      () => setFocus(true),
    onBlur:       () => setFocus(false),
  };

  return { borderColor, boxShadow, handlers };
};

const Input = ({ error, onBlur, ...props }) => {
  const { borderColor, boxShadow, handlers } = useFieldStyle(!!error);
  return (
    <input
      {...props}
      {...handlers}
      onBlur={(e) => { handlers.onBlur(); onBlur?.(e); }}
      className="w-full text-[13px] rounded-lg px-3 py-2.5 outline-none bg-white placeholder:text-gray-300 transition-all duration-150"
      style={{ color: "var(--primary)", border: `1px solid ${borderColor}`, boxShadow }}
    />
  );
};

const Select = ({ error, onBlur, children, ...props }) => {
  const { borderColor, boxShadow, handlers } = useFieldStyle(!!error);
  return (
    <div className="relative w-full">
      <select
        {...props}
        {...handlers}
        onBlur={(e) => { handlers.onBlur(); onBlur?.(e); }}
        className="w-full text-[13px] rounded-lg px-3 py-2.5 pr-8 outline-none bg-white appearance-none transition-all duration-150"
        style={{ color: props.value ? "var(--primary)" : "rgba(6,11,39,0.35)", border: `1px solid ${borderColor}`, boxShadow }}
      >
        {children}
      </select>
      <FiChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(6,11,39,0.35)" }} />
    </div>
  );
};

const Textarea = ({ error, onBlur, ...props }) => {
  const { borderColor, boxShadow, handlers } = useFieldStyle(!!error);
  return (
    <textarea
      {...props}
      {...handlers}
      onBlur={(e) => { handlers.onBlur(); onBlur?.(e); }}
      className="w-full text-[13px] rounded-lg px-3 py-2.5 outline-none bg-white placeholder:text-gray-300 transition-all duration-150 resize-none"
      style={{ color: "var(--primary)", border: `1px solid ${borderColor}`, boxShadow }}
    />
  );
};

const ProjectForm = ({ show, handleClose, onProjectCreated }) => {
  const emptyForm = { nom_projet: '', type_projet: 'Bâtiment', description: '', contrat_id: '', status: 'En attente' };

  const [formData, setFormData] = useState(emptyForm);
  const [contrats, setContrats] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState(null);
  const [errors,   setErrors]   = useState({});
  const [touched,  setTouched]  = useState({});

  useEffect(() => {
    if (!show) return;
    setFormData(emptyForm); setErrors({}); setTouched({}); setApiError(null);
    fetchContrats();
  }, [show]);

  const fetchContrats = async () => {
    try {
      setLoading(true);
      const res  = await axios.get(`${API}/get/contrats`);
      const list = Array.isArray(res.data) ? res.data : res.data?.data ?? res.data?.contrats ?? [];
      setContrats(list);
    } catch {
      setApiError("Impossible de charger les contrats.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);
    if (touched[name]) {
      const newErrs = validate(next);
      setErrors(prev => ({ ...prev, [name]: newErrs[name] }));
    }
  };

  const handleBlur = e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(formData)[name] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const allTouched = Object.keys(emptyForm).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    const newErrs = validate(formData);
    setErrors(newErrs);
    if (Object.keys(newErrs).length > 0) return;
    try {
      setSaving(true); setApiError(null);
      await axios.post(`${API}/create/projects`, formData);
      handleClose();
      onProjectCreated?.();
    } catch (err) {
      setApiError(err.response?.data?.message || "Erreur lors de la création du projet.");
    } finally {
      setSaving(false);
    }
  };

  const selectedContrat = contrats.find(c => String(c.id_contrat) === String(formData.contrat_id));

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,11,39,0.48)" }}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="flex flex-col w-full"
        style={{
          maxWidth:     700,
          maxHeight:    "90vh",
          background:   "var(--bg)",
          borderRadius: 16,
          border:       "0.5px solid rgba(6,11,39,0.10)",
          boxShadow:    "0 24px 72px rgba(6,11,39,0.22)",
          overflow:     "hidden",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "0.5px solid rgba(6,11,39,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--secondary)" }}>
              <FiFileText size={15} color="#fff" />
            </div>
            <div>
              <h5 className="text-[15px] font-semibold m-0 leading-tight" style={{ color: "var(--primary)" }}>Nouveau projet</h5>
              <p className="text-[11px] m-0" style={{ color: "rgba(6,11,39,0.4)" }}>Renseignez les informations du projet</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 hover:bg-[rgba(6,11,39,0.06)]"
            style={{ border: "0.5px solid rgba(6,11,39,0.10)", color: "rgba(6,11,39,0.4)" }}
          >
            <FiX size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">

          {apiError && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium mb-4"
              style={{ background: "rgba(245,9,9,0.06)", color: "var(--error)", border: "0.5px solid rgba(245,9,9,0.2)" }}
            >
              <FiAlertCircle size={14} className="shrink-0" />
              {apiError}
            </div>
          )}

          <div className="mb-4">
            <Field label="Contrat" required error={errors.contrat_id}>
              {loading ? (
                <div className="flex items-center gap-2 text-[12px] py-2" style={{ color: "rgba(6,11,39,0.4)" }}>
                  <FiLoader size={13} className="animate-spin" /> Chargement des contrats…
                </div>
              ) : (
                <Select name="contrat_id" value={formData.contrat_id} onChange={handleChange} onBlur={handleBlur} error={errors.contrat_id}>
                  <option value="">— Choisir un contrat —</option>
                  {contrats.map(c => (
                    <option key={c.id_contrat} value={c.id_contrat}>
                      #{c.id_contrat} — {c.type_contrat} | {c.client} | {Number(c.budget).toLocaleString("fr-FR")} F
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>

          {selectedContrat && (
            <div
              className="flex items-center gap-5 px-3.5 py-2.5 rounded-lg text-[12px] mb-4"
              style={{ background: "rgba(12,122,196,0.06)", border: "0.5px solid rgba(12,122,196,0.20)" }}
            >
              <span className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--secondary)" }}>
                <FiDollarSign size={13} />
                {Number(selectedContrat.budget).toLocaleString("fr-FR")} F CFA
              </span>
              <span className="flex items-center gap-1.5" style={{ color: "rgba(6,11,39,0.45)" }}>
                <FiCalendar size={12} />
                {selectedContrat.date_debut ? new Date(selectedContrat.date_debut).toLocaleDateString("fr-FR") : "—"}
                {" → "}
                {selectedContrat.date_fin ? new Date(selectedContrat.date_fin).toLocaleDateString("fr-FR") : "—"}
              </span>
            </div>
          )}

          <div className="mb-4">
            <Field label="Nom du projet" required error={errors.nom_projet}>
              <Input
                type="text" name="nom_projet" value={formData.nom_projet}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Ex : Construction Pont sur Comoé"
                error={errors.nom_projet}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Type de projet" required error={errors.type_projet}>
              <Select name="type_projet" value={formData.type_projet} onChange={handleChange} onBlur={handleBlur} error={errors.type_projet}>
                {TYPES_PROJET.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Statut initial">
              <Select name="status" value={formData.status} onChange={handleChange}>
                <option value="En attente">En attente</option>
                <option value="En cours">En cours</option>
              </Select>
            </Field>
          </div>

          <Field label="Description" error={errors.description}>
            <Textarea
              name="description" value={formData.description}
              onChange={handleChange} onBlur={handleBlur}
              rows={3} placeholder="Détails, remarques, contexte du projet…"
              error={errors.description}
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 shrink-0" style={{ borderTop: "0.5px solid rgba(6,11,39,0.08)" }}>
          <button
            type="button" onClick={handleClose}
            className="px-4 py-2 text-[13px] font-medium rounded-lg transition-colors duration-150 hover:bg-[rgba(6,11,39,0.05)]"
            style={{ color: "rgba(6,11,39,0.5)", border: "0.5px solid rgba(6,11,39,0.12)" }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit} disabled={saving || loading}
            className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold rounded-lg text-white transition-all duration-150 disabled:opacity-50"
            style={{ background: "var(--secondary)" }}
          >
            {saving && <FiLoader size={13} className="animate-spin" />}
            {saving ? "Création…" : "Créer le projet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;