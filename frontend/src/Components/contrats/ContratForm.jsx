import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../../Utils/IP";

export default function ContratForm() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: "",
    type_contrat: "",
    budget: "",
    date_debut: "",
    date_fin: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${base_url}/contrat/create`,formData, {

        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
      )
      alert("Contrat ajouté avec succes");
      navigate("/Contrats");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto py-10 px-6 space-y-6">
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Nouveau contrat</h2>
    <p className="text-sm text-gray-400 mt-1">Renseignez les informations du contrat</p>
  </div>
  <div className="grid grid-cols-2 gap-4">
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Client ID</label>
      <input
        name="user_id"
        value={formData.user_id}
        onChange={handleChange}
        required
        className="border-0 border-b border-gray-200 pb-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
      />
    </div>
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type de contrat</label>
      <input
        name="type_contrat"
        value={formData.type_contrat}
        onChange={handleChange}
        required
        className="border-0 border-b border-gray-200 pb-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
      />
    </div>
  </div>
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</label>
    <input
      name="budget"
      value={formData.budget}
      onChange={handleChange}
      required
      className="border-0 border-b border-gray-200 pb-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
    />
  </div>
  <div className="grid grid-cols-2 gap-4">
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date de début</label>
      <input
        type="date"
        name="date_debut"
        value={formData.date_debut}
        onChange={handleChange}
        className="border-0 border-b border-gray-200 pb-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
      />
    </div>
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date de fin</label>
      <input
        type="date"
        name="date_fin"
        value={formData.date_fin}
        onChange={handleChange}
        className="border-0 border-b border-gray-200 pb-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
      />
    </div>
  </div>
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-[var(--primary)] uppercase tracking-wider">Description</label>
    <textarea
      name="description"
      placeholder="Décrivez le contrat..."
      value={formData.description}
      onChange={handleChange}
      rows={4}
      className="border-0 border-b border-gray-200 pb-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-transparent resize-none"
    />
  </div>

  {/* Bouton */}
  <div className="pt-4">
    <button
      type="submit"
      className="w-full bg-gray-900 text-white text-sm font-medium py-3 rounded-none tracking-wide hover:bg-gray-700 transition-colors"
    >
      Enregistrer
    </button>
  </div>

</form>
  );
}