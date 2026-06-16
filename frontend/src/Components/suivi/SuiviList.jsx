import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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
    <div>
      <h2>Suivi des Travaux</h2>
      <button onClick={() => navigate("/suivis/add")}>➕ Ajouter Suivi</button>
      <table border="1" cellPadding="8" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tâche</th>
            <th>Avancement</th>
            <th>Commentaire</th>
            <th>Photo</th>
            <th>Date</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suivis.map((s) => (
            <tr key={s.id_suivi}>
              <td>{s.id_suivi}</td>
              <td>{s.tache_id}</td>
              <td>{s.avancement}%</td>
              <td>{s.commentaire}</td>
              <td>
                {s.photo && (
                  <img
                    src={`http://localhost:3000${s.photo}`}
                    alt="suivi"
                    width="100"
                    style={{ borderRadius: "4px" }}
                  />
                )}
              </td>
              <td>
              
                {s.created_at ? new Date(s.created_at).toLocaleDateString() : ""}
              </td>
              <td>
                <button onClick={() => navigate(`/suivis/edit/${s.id_suivi}`)}>✏️ Modifier</button>
                <button onClick={() => handleDelete(s.id_suivi)}>🗑️ Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}