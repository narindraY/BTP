import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getContratById, updateContrat } from "../../services/api";
import "../../App.css";

export default function EditContratPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    type_contrat: "",
    budget: "",
    date_debut: "",
    date_fin: "",
    description: ""
  });

  useEffect(() => {
    getContratById(id).then((res) => setFormData(res.data));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateContrat(id, formData);
      alert("Contrat modifié ✨");
      navigate("/Contrats");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h2>✏️ Modifier Contrat</h2>
      <form className="contrat-form" onSubmit={handleSubmit}>
        <input name="type_contrat" value={formData.type_contrat} onChange={handleChange} placeholder="Type de contrat" />
        <input name="budget" value={formData.budget} onChange={handleChange} placeholder="Budget" />
        <input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} />
        <input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
        <button className="btn-primary" type="submit">Enregistrer</button>
      </form>
    </div>
  );
}
