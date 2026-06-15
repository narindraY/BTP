import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function SuiviForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tache_id: "",
    avancement: "",
    commentaire: "",
    photo: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("tache_id", formData.tache_id);
      data.append("avancement", formData.avancement);
      data.append("commentaire", formData.commentaire);
      if (formData.photo) data.append("file", formData.photo);

      await api.post("/create/suivis", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Suivi ajouté avec succes");
      navigate("/suivis");
    } catch (err) {
      console.error("Erreur ajout suivi:", err);
      alert("Erreur ajout suivi ");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="tache_id" placeholder="ID tâche" value={formData.tache_id} onChange={handleChange} required />
      <input type="number" name="avancement" placeholder="Avancement %" value={formData.avancement} onChange={handleChange} required />
      <textarea name="commentaire" placeholder="Commentaire" value={formData.commentaire} onChange={handleChange} />
      <input type="file" name="photo" accept="image/*" onChange={handleChange} />
      <button type="submit">Enregistrer</button>
    </form>
  );
}