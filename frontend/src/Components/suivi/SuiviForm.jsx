import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FiTrendingUp,
  FiMessageSquare,
  FiUpload,
  FiLoader,
  FiAlertCircle,
  FiX
} from "react-icons/fi";

export default function SuiviForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projet_id: "",
    avancement: "",
    commentaire: "",
    photo: null
  });

  const [projets, setProjets] = useState([]);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  // 📦 Charger les projets
  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const res = await api.get("/projects");
        setProjets(res.data);
      } catch (err) {
        console.error("Erreur chargement projets:", err);
      }
    };

    fetchProjets();
  }, []);

  // 🔁 handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ❌ close modal
  const handleClose = () => navigate("/suivi");

  // 💾 submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSaving(true);

    try {
      const data = new FormData();

      data.append("projet_id", formData.projet_id);
      data.append("avancement", formData.avancement);
      data.append("commentaire", formData.commentaire);

      if (formData.photo) {
        data.append("file", formData.photo);
      }

      await api.post("/create/suivis", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate("/suivi");
    } catch (err) {
      console.error("Erreur ajout suivi:", err);
      setApiError("Erreur lors de l'ajout du suivi. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center mt-10 bg-slate-950/50 p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh]">

        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]">
              <FiTrendingUp size={16} className="text-white" />
            </div>
            <div>
              <h5 className="text-[15px] font-semibold text-slate-900">
                Nouveau suivi
              </h5>
              <p className="text-[11px] text-slate-400">
                Renseignez l'avancement des travaux
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"
          >
            <FiX size={15} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">

          <div className="flex-1 space-y-5 px-6 py-5">

            {apiError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-600">
                <FiAlertCircle size={14} />
                {apiError}
              </div>
            )}

            {/* PROJET */}
            <div>
              <label className="mb-1.5 text-[13px] font-medium text-slate-700">
                Projet <span className="text-red-500">*</span>
              </label>

              <select
                name="projet_id"
                value={formData.projet_id}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100"
              >
                <option value="">-- Choisir un projet --</option>

                {projets.map((p) => (
                  <option key={p.id_projet} value={p.id_projet}>
                    {p.nom_projet}
                  </option>
                ))}
              </select>
            </div>

            {/* AVANCEMENT */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                <FiTrendingUp size={14} className="text-[var(--primary)]" />
                Avancement <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="number"
                  name="avancement"
                  min="0"
                  max="100"
                  value={formData.avancement}
                  onChange={handleChange}
                  required
                  placeholder="Ex : 45"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pr-9 text-[13px]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  %
                </span>
              </div>
            </div>

            {/* COMMENTAIRE */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                <FiMessageSquare size={14} className="text-[var(--primary)]" />
                Commentaire
              </label>

              <textarea
                name="commentaire"
                rows={3}
                value={formData.commentaire}
                onChange={handleChange}
                placeholder="Détails sur l'avancement..."
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px]"
              />
            </div>

            {/* PHOTO */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                <FiUpload size={14} className="text-[var(--primary)]" />
                Photo
              </label>

              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-6 hover:bg-blue-50/40">
                <FiUpload size={18} className="text-slate-400" />
                <span className="text-[12px] text-slate-500">
                  {formData.photo?.name || "Cliquez pour ajouter une photo"}
                </span>

                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">

            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border px-4 py-2 text-slate-500 hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2 text-white disabled:opacity-50"
            >
              {saving && <FiLoader className="animate-spin" size={14} />}
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}