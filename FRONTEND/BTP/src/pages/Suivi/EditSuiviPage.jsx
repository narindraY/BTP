import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../../App.css";

export default function EditSuiviPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ avancement: "", commentaire: "", photo: "" });

  useEffect(() => {
    api.get(`/suivis/id/${id}`).then((res) => setFormData(res.data));   // ✅ corrigé
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/suivis/${id}`, formData);
      alert("Suivi modifié ✨");
      navigate("/suivis");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="contrat-form" onSubmit={handleSubmit}>
      <h2>✏️ Modifier Suivi</h2>
      <input name="avancement" value={formData.avancement} onChange={(e) => setFormData({ ...formData, avancement: e.target.value })} />
      <textarea name="commentaire" value={formData.commentaire} onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })} />
      <input name="photo" value={formData.photo} onChange={(e) => setFormData({ ...formData, photo: e.target.value })} />
      <button className="btn-primary" type="submit">Enregistrer</button>
    </form>
  );
}
