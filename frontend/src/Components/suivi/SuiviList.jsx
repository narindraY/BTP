import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function SuiviList() {
  const navigate = useNavigate();
  const [suivis, setSuivis] = useState([]);

  
  const fetchSuivis = async () => {
    try {
      const res = await api.get("/suivis");
      setSuivis(res.data);
    } catch (err) {
      console.error("Erreur fetch suivis:", err);
    }
  };

  useEffect(() => {
    fetchSuivis();
  }, []);

 
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce suivi ?")) return;
    try {
      await api.delete(`/suivis/${id}`);
      fetchSuivis();
    } catch (err) {
      console.error("Erreur suppression suivi:", err);
    }
  };

  return (

<div className="p-6">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-gray-800">Suivi des Travaux</h2>
    <button
      onClick={() => navigate("/suivis/add")}
      className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--hoover)] text-white hover:text-[var(--primary)] px-4 py-2 rounded-lg shadow-sm transition-colors"
    >
      <FiPlus size={18} />
      Ajouter Suivi
    </button>
  </div>

  <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
        <tr>
          <th className="px-4 py-3">Avancement</th>
          <th className="px-4 py-3">Commentaire</th>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {suivis.map((s) => (
          <tr key={s.id_suivi} className="hover:bg-gray-50 transition-colors">
            <td className="px-3 py-2">
              <span className="inline-flex items-center rounded-full font-medium">
                {s.avancement}%
              </span>
            </td>
            <td className="px-3 py-2 text-gray-700">{s.commentaire}</td>
  
            <td className="px-4 py-3 text-gray-500">
              {s.created_at ? new Date(s.created_at).toLocaleDateString() : ""}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => navigate(`/suivis/edit/${s.id_suivi}`)}
                  className="flex items-center gap-1 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <FiEdit2 size={14} color="black" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(s.id_suivi)}
                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <FiTrash2 size={14} color="white" />
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}