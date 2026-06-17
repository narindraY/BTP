import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../../Utils/IP";
import { FiX, FiAlertCircle, FiFileText} from "react-icons/fi";
import { useEffect } from "react";

export default function ContratForm() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    type_contrat: "",
    budget: "",
    date_debut: "",
    date_fin: "",
    description: ""
  });
  useEffect(() => {
  console.log("formData:", formData);
}, [formData]);
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${base_url}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement users", err);
    }
  };

  fetchUsers();
}, []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      await axios.post(`${base_url}/contrat/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      navigate("/Contrats");
    } catch (err) {
      setError("Erreur lors de la création du contrat.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50">

      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Nouveau contrat
            </h2>
            <p className="text-xs text-gray-400">
              Renseignez les informations du contrat
            </p>
          </div>

          <button
            onClick={() => navigate("/Contrats")}
            className="text-gray-400 hover:text-gray-700"
          >
            <FiX />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {error && (
            <div className="text-sm text-red-500 flex items-center gap-2">
              <FiAlertCircle size={14} />
              {error}
            </div>
          )}

          {/* GRID TOP */}
          <div className="grid grid-cols-2 gap-4">

           <div className="flex flex-col gap-1.5">
  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
    Client
  </label>

 <select
  name="user_id"
  value={formData.user_id}
  onChange={handleChange}
>
  <option value="">-- Choisir un client --</option>

  {users.map((user) => (
    <option key={user.id_user} value={user.id_user}>
      {user.nom_user}
    </option>
  ))}
</select>
</div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type contrat
              </label>
              <input
                name="type_contrat"
                value={formData.type_contrat}
                onChange={handleChange}
                className="border-0 border-b border-gray-200 pb-2 text-sm focus:outline-none focus:border-gray-900 bg-transparent"
              />
            </div>

          </div>

          {/* BUDGET */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Budget
            </label>
            <input
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="border-0 border-b border-gray-200 pb-2 text-sm focus:outline-none focus:border-gray-900 bg-transparent"
            />
          </div>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date début
              </label>
              <input
                type="date"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                className="border-0 border-b border-gray-200 pb-2 text-sm focus:outline-none focus:border-gray-900 bg-transparent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date fin
              </label>
              <input
                type="date"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
                className="border-0 border-b border-gray-200 pb-2 text-sm focus:outline-none focus:border-gray-900 bg-transparent"
              />
            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="border-0 border-b border-gray-200 pb-2 text-sm focus:outline-none focus:border-gray-900 bg-transparent resize-none"
              placeholder="Décrivez le contrat..."
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gray-900 text-white text-sm font-medium py-3 hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiFileText/>  Enregister
          </button>

        </form>
      </div>
    </div>
  );
}