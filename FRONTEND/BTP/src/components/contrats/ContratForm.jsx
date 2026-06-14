import React, { useState } from "react";
import "../../App.css";
import { addContrat } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ContratForm() {
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
      await addContrat(formData);
      alert("Contrat ajouté avec succes");
      navigate("/Contrats");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="contrat-form" onSubmit={handleSubmit}>
      <input name="user_id" placeholder="Client ID" value={formData.user_id} onChange={handleChange} required />
      <input name="type_contrat" placeholder="Type de contrat" value={formData.type_contrat} onChange={handleChange} required />
      <input name="budget" placeholder="Budget" value={formData.budget} onChange={handleChange} required />
      <input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} />
      <input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
      <button className="btn-primary" type="submit">Enregistrer</button>
    </form>
  );
}
