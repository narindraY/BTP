import React, { useEffect, useState } from "react";
import "../../App.css";
import { getContrats, deleteContrat } from "../../services/api";
import { useNavigate } from "react-router-dom";
import ContratTable from "./ContratTable";
import ContratActions from "./ContratActions";

export default function ContratList() {
  const navigate = useNavigate();
  const [contrats, setContrats] = useState([]);
  const [search, setSearch] = useState("");

  const fetchContrats = async () => {
    try {
      const res = await getContrats();
      setContrats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContrats();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous supprimer ce contrat ?")) return;
    try {
      await deleteContrat(id);
      fetchContrats();
      alert("Contrat supprimé avec succes");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h2>Liste des Contrats</h2>
      <p>Gérez tous vos contrats de construction</p>
      <ContratActions onAdd={() => navigate("/Contrats/add")} onSearch={setSearch} />
      <ContratTable contrats={contrats} onView={(c) => alert(JSON.stringify(c, null, 2))} onEdit={(c) => navigate(`/Contrats/edit/${c.id_contrat}`)} onDelete={handleDelete} />
    </div>
  );
}