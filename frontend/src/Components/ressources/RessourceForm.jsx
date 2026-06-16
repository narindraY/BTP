import { useState, useEffect } from 'react';
import { FiX, FiAlertCircle, FiPackage } from 'react-icons/fi';

const useFieldStyle = (hasError) => {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  const borderColor = hasError
    ? "var(--error)"
    : focus
    ? "var(--secondary)"
    : hover
    ? "rgba(12,122,196,0.40)"
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

const validate = (data) => {
  const errs = {};
  if (!data.nom_ressource.trim())
    errs.nom_ressource = "Le nom est obligatoire.";
  else if (data.nom_ressource.trim().length < 2)
    errs.nom_ressource = "Minimum 2 caractères.";

  if (!data.unite.trim())
    errs.unite = "L'unité est obligatoire.";

  if (data.quantite === "" || data.quantite === null || data.quantite === undefined)
    errs.quantite = "La quantité est obligatoire.";
  else if (Number(data.quantite) < 0)
    errs.quantite = "La quantité ne peut pas être négative.";

  if (data.prix_unitaire === "" || data.prix_unitaire === null || data.prix_unitaire === undefined)
    errs.prix_unitaire = "Le prix unitaire est obligatoire.";
  else if (Number(data.prix_unitaire) < 0)
    errs.prix_unitaire = "Le prix ne peut pas être négatif.";

  return errs;
};

const ResourceForm = ({ show, handleClose, handleSubmit, initialData, activeType }) => {
  const empty = {
    nom_ressource:  "",
    quantite:       "",
    prix_unitaire:  "",
    unite:          "",
    type_ressource: activeType || "Matériau",
  };

  const [formData, setFormData] = useState(empty);
  const [errors,   setErrors]   = useState({});
  const [touched,  setTouched]  = useState({});

  useEffect(() => {
    if (!show) return;
    setErrors({}); setTouched({});
    setFormData(initialData ? initialData : { ...empty, type_ressource: activeType || "Matériau" });
  }, [initialData, show, activeType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);
    if (touched[name]) {
      const newErrs = validate(next);
      setErrors(prev => ({ ...prev, [name]: newErrs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(formData)[name] }));
  };

  const onSubmit = () => {
    const allTouched = Object.keys(empty).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    const newErrs = validate(formData);
    setErrors(newErrs);
    if (Object.keys(newErrs).length > 0) return;
    handleSubmit(formData);
  };

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
          maxWidth:     680,
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
              <FiPackage size={15} color="#fff" />
            </div>
            <div>
              <h5 className="text-[15px] font-semibold m-0 leading-tight" style={{ color: "var(--primary)" }}>
                {initialData ? "Modifier la ressource" : "Ajouter une ressource"}
              </h5>
              <p className="text-[11px] m-0" style={{ color: "rgba(6,11,39,0.4)" }}>{activeType || "Matériau"}</p>
            </div>
          </div>
          <button
            type="button" onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 hover:bg-[rgba(6,11,39,0.06)]"
            style={{ border: "0.5px solid rgba(6,11,39,0.10)", color: "rgba(6,11,39,0.4)" }}
          >
            <FiX size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">

          <div className="mb-4">
            <Field label="Nom de la ressource" required error={errors.nom_ressource}>
              <Input
                type="text" name="nom_ressource" value={formData.nom_ressource}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Ex : Ciment, Ingénieur, Grue…"
                error={errors.nom_ressource}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Unité" required error={errors.unite}>
              <Input
                type="text" name="unite" value={formData.unite}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Sac, m², Tonne…"
                error={errors.unite}
              />
            </Field>
            <Field label="Stock (quantité)" required error={errors.quantite}>
              <Input
                type="number" name="quantite" value={formData.quantite}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="0" min="0"
                error={errors.quantite}
              />
            </Field>
          </div>

          <Field label="Prix unitaire (FCFA)" required error={errors.prix_unitaire}>
            <Input
              type="number" name="prix_unitaire" value={formData.prix_unitaire}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="0" min="0"
              error={errors.prix_unitaire}
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
            type="button" onClick={onSubmit}
            className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold rounded-lg text-white transition-all duration-150 hover:opacity-85"
            style={{ background: "var(--secondary)" }}
          >
            {initialData ? "Enregistrer" : "+ Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;