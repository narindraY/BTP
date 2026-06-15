import { useState, useEffect } from 'react';
import axios from 'axios';
import ResourceTable from '../../components/ressources/RessourceTable';
import ResourceForm from '../../components/ressources/RessourceForm';
import { base_url } from '../../Utils/IP';

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
      const res = await axios.get(`${base_url}/ressource/getall?type=${encodeURIComponent(type)}`);
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
      await axios.delete(`${base_url}/ressource/delete/${id}`);
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
        await axios.put(`${base_url}/ressource/update/${currentResource.id_ressource}`, payload);
      } else {
        await axios.post(`${base_url}/ressource/create`, payload);
      }
      setShowModal(false);
      fetchResources(activeTab);
    } catch (err) {
      const status = err.response?.status;
      const msg    = err.response?.data?.message;
      console.error("Erreur sauvegarde:", err);
      if (status === 404) {
        alert(`Route introuvable (404) : vérifiez que API_URL="${base_url}" correspond à votre backend.`);
      } else {
        alert(msg || `Erreur ${status || ''} lors de la sauvegarde.`);
      }
    }
  };

  return (
    <div className="w-full px-6 py-8">

      <h1 className="text-xl font-bold text-gray-800 mb-6">Ressources</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full">

        {/* Tabs header */}
        <div className="border-b border-gray-200 px-4 pt-3">
          <ul className="flex gap-1">
            {TABS.map(tab => (
              <li key={tab.value}>
                <button
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors duration-150
                    ${activeTab === tab.value
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Table body */}
        <div>
          {error ? (
            <p className="text-center text-red-500 text-sm py-8">{error}</p>
          ) : (
            <ResourceTable
              resources={resources}
              loading={loading}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 flex justify-end px-4 py-3">
          <button
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150"
          >
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