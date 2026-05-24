import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResourceTable from '../../components/ressources/RessourceTable';
import ResourceForm  from '../../components/ressources/RessourceForm';

const API_URL = "http://localhost:5000/api/resources";

const TABS = [
  { label: "Matériaux",     value: "Matériau" },
  { label: "Main-d'œuvre", value: "Main-d'œuvre" },
  { label: "Équipements",  value: "Équipement" },
];

const Ressources = () => {
  const [resources, setResources]             = useState([]);
  const [activeTab, setActiveTab]             = useState("Matériau");
  const [showModal, setShowModal]             = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState(null);

  const fetchResources = async (type = activeTab) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}?type=${encodeURIComponent(type)}`);
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? res.data?.resources ?? res.data?.ressources ?? [];
      setResources(list);
    } catch (err) {
      console.error("Erreur fetch ressources:", err);
      setError("Impossible de charger les ressources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(activeTab); }, [activeTab]);

  const handleOpenAdd  = () => { setCurrentResource(null); setShowModal(true); };
  const handleOpenEdit = (resource) => { setCurrentResource(resource); setShowModal(true); };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette ressource ?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchResources(activeTab);
    } catch (err) {
      const msg = err.response?.data?.message || `Erreur ${err.response?.status || ''} lors de la suppression.`;
      alert(msg);
    }
  };

  const handleSave = async (formData) => {
    try {
      const payload = { ...formData, type_ressource: activeTab };
      if (currentResource) {
        await axios.put(`${API_URL}/${currentResource.id_ressource}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      setShowModal(false);
      fetchResources(activeTab);
    } catch (err) {
      const status = err.response?.status;
      const msg    = err.response?.data?.message;
      console.error("Erreur sauvegarde:", err);
      if (status === 404) {
        alert(`Route introuvable (404) : vérifiez que API_URL="${API_URL}" correspond à votre backend.`);
      } else {
        alert(msg || `Erreur ${status || ''} lors de la sauvegarde.`);
      }
    }
  };

  return (
    <div className="container-fluid py-4">

      <h1 className="h4 fw-bold text-dark mb-4">Ressources</h1>

      <div className="card border-0 shadow-sm" style={{ borderRadius: "16px", width: "100%" }}>

        <div className="card-header bg-white border-bottom px-3 pt-3 pb-0">
          <ul className="nav nav-tabs border-0">
            {TABS.map(tab => (
              <li className="nav-item" key={tab.value}>
                <button
                  className={`nav-link fw-semibold border-0 ${activeTab === tab.value ? "active text-primary" : "text-muted"}`}
                  onClick={() => setActiveTab(tab.value)}
                  style={{ fontSize: "14px" }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body p-0">
          {error ? (
            <div className="text-center text-danger py-4" style={{ fontSize: "14px" }}>{error}</div>
          ) : (
            <ResourceTable
              resources={resources}
              loading={loading}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        <div className="card-footer bg-white border-top d-flex justify-content-end py-3 px-3">
          <button className="btn btn-primary fw-semibold" onClick={handleOpenAdd}>
            + Ajouter
          </button>
        </div>
      </div>

      <ResourceForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSubmit={handleSave}
        initialData={currentResource}
        activeType={activeTab}
      />
    </div>
  );
};

export default Ressources;