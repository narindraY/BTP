import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2, FiLoader, FiAlertCircle, FiCalendar, FiDollarSign, FiFileText, FiTag, FiArrowLeft, FiCheck } from "react-icons/fi";
import { getContratById, updateContrat } from "../../services/api";

const inputClass = `
  w-full text-[13px] rounded-lg px-3 py-2 outline-none transition-all duration-150
  border border-[rgba(6,11,39,0.12)] bg-white
  focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/10
  placeholder:text-[rgba(6,11,39,0.25)]
`;

const FIELDS = [
  { name: "type_contrat", label: "Type de contrat", icon: <FiTag size={13} />,      type: "text",     placeholder: "Ex : Travaux publics" },
  { name: "budget",       label: "Budget (FCFA)",   icon: <FiDollarSign size={13} />, type: "number",   placeholder: "Ex : 5000000" },
  { name: "date_debut",   label: "Date de début",   icon: <FiCalendar size={13} />,  type: "date" },
  { name: "date_fin",     label: "Date de fin",     icon: <FiCalendar size={13} />,  type: "date" },
];

const Label = ({ icon, children }) => (
  <label className="flex items-center gap-1.5 text-[12px] font-semibold mb-1.5" style={{ color: "var(--primary)" }}>
    <span style={{ color: "rgba(6,11,39,0.35)" }}>{icon}</span>
    {children}
  </label>
);

export default function EditContratPage() {
  const navigate  = useNavigate();
  const { id }    = useParams();

  const [formData, setFormData] = useState({
    type_contrat: "", budget: "", date_debut: "", date_fin: "", description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getContratById(id, { signal: controller.signal });
        setFormData(res.data);
      } catch (err) {
        if (err.code === "ERR_CANCELED") return;
        setError("Impossible de charger le contrat.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
    return () => controller.abort();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await updateContrat(id, formData);
      navigate("/Contrats");
    } catch {
      setError("Erreur lors de la mise à jour.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center gap-2 py-32 text-[13px]" style={{ color: "rgba(6,11,39,0.4)" }}>
      <FiLoader size={16} className="animate-spin" /> Chargement du contrat…
    </div>
  );

  return (
    <div className="px-4 py-6 max-w-xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/Contrats")}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ border: "0.5px solid rgba(6,11,39,0.12)", color: "rgba(6,11,39,0.4)" }}
        >
          <FiArrowLeft size={15} />
        </button>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--secondary)" }}>
          <FiEdit2 size={14} color="#fff" />
        </div>
        <div>
          <h2 className="text-[18px] font-semibold m-0" style={{ color: "var(--primary)" }}>
            Modifier le contrat
          </h2>
          <p className="text-[12px] m-0" style={{ color: "rgba(6,11,39,0.4)" }}>CT-{id}</p>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium mb-4"
          style={{ background: "rgba(245,9,9,0.06)", color: "var(--error)", border: "0.5px solid rgba(245,9,9,0.2)" }}
        >
          <FiAlertCircle size={14} className="shrink-0" /> {error}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit}>
        <div
          className="flex flex-col gap-4 p-5 rounded-xl"
          style={{ background: "var(--bg)", border: "0.5px solid rgba(6,11,39,0.1)", boxShadow: "0 1px 4px rgba(6,11,39,0.06)" }}
        >
          {FIELDS.map(({ name, label, icon, type, placeholder }) => (
            <div key={name}>
              <Label icon={icon}>{label}</Label>
              <input
                type={type}
                name={name}
                value={formData[name] ?? ""}
                onChange={handleChange}
                placeholder={placeholder}
                className={inputClass}
                style={{ color: "var(--primary)" }}
              />
            </div>
          ))}

          <div>
            <Label icon={<FiFileText size={13} />}>Description</Label>
            <textarea
              name="description"
              value={formData.description ?? ""}
              onChange={handleChange}
              rows={4}
              placeholder="Détails du contrat…"
              className={inputClass}
              style={{ color: "var(--primary)", resize: "none" }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => navigate("/Contrats")}
            className="px-4 py-2 text-[13px] font-medium rounded-lg"
            style={{ color: "rgba(6,11,39,0.5)", border: "0.5px solid rgba(6,11,39,0.12)" }}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-lg text-white"
            style={{ background: "var(--secondary)" }}
          >
            <FiCheck size={13} />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}