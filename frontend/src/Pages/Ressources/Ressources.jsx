import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ResourceTable from '../../components/ressources/RessourceTable';
import ResourceForm from '../../components/ressources/RessourceForm';
import { base_url } from '../../Utils/IP';
import { FaPlus } from 'react-icons/fa';

const Ressources = () => {
  const { projet_id: paramProjetId } = useParams();


  const [projets, setProjets] = useState([]);
  const [selectedProjetId, setSelectedProjetId] = useState(paramProjetId || '');
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProjets, setLoadingProjets] = useState(false);
  const [error, setError] = useState(null);

  // Charger la liste des projets au montage
  useEffect(() => {
    const fetchProjets = async () => {
      try {
        setLoadingProjets(true);
        const res = await axios.get(`${base_url}/projects`);
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        setProjets(list);
      } catch (err) {
        console.error('Erreur chargement projets', err);
      } finally {
        setLoadingProjets(false);
      }
    };
    fetchProjets();
  }, []);

  // Charger les ressources quand le projet sélectionné change
  const fetchResources = async (projetId) => {
    if (!projetId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${base_url}/ressource/getall`, {
        params: { projet_id: projetId },
      });
      const raw = res.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.ressources)
            ? raw.ressources
            : [];
      setResources(list);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Impossible de charger les ressources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(selectedProjetId);
  }, [selectedProjetId]);

  const handleProjetChange = (e) => {
    const id = e.target.value;
    setSelectedProjetId(id);
    setResources([]);
    // Optionnel : met à jour l'URL pour garder la navigation cohérente

  };

  const handleOpenAdd = () => {
    setCurrentResource(null);
    setShowModal(true);
  };

  const handleOpenEdit = (resource) => {
    setCurrentResource(resource);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette ressource ?')) return;
    try {
      await axios.delete(`${base_url}/ressource/delete/${id}`);
      fetchResources(selectedProjetId);
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur suppression');
    }
  };

  const handleSave = async (formData) => {
    try {
      const payload = { ...formData, projet_id: selectedProjetId };
      if (currentResource) {
        await axios.put(
          `${base_url}/ressource/update/${currentResource.id_ressource}`,
          payload
        );
      } else {
        await axios.post(`${base_url}/ressource/create`, payload);
      }
      setShowModal(false);
      fetchResources(selectedProjetId);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const projetSelectionne = projets.find(
    (p) => String(p.id_projet) === String(selectedProjetId)
  );

  return (
    <div className="w-full px-6 py-8">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Ressources</h1>
       <div className="border-t border-gray-100 flex justify-end px-4 py-3">
          <button
            onClick={handleOpenAdd}
            disabled={!selectedProjetId}
            className="bg-[var(--primary)] flex  items-center gap-1 hover:bg-[var(--hoover)]  hover:text-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            <FaPlus/> Ajouter
          </button>
        </div>
      {/* Sélecteur de projet */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Projet
        </label>
        <select
          value={selectedProjetId}
          onChange={handleProjetChange}
          disabled={loadingProjets}
          className="w-full border bg-[var(--primary)] text-white border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 "
        >
          <option value="">
            {loadingProjets ? 'Chargement...' : '— Sélectionner un projet —'}
          </option>
          {projets.map((p) => (
            <option key={p.id_projet} value={p.id_projet}>
              {p.nom_projet ?? p.name ?? p.titre ?? `Projet #${p.id_projet}`}
            </option>
          ))}
        </select>
      </div>

      {/* Table des ressources */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full">
        <div>
          {!selectedProjetId ? (
            <p className="text-center text-gray-400 text-sm py-12">
              Sélectionnez un projet pour afficher ses ressources.
            </p>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => fetchResources(selectedProjetId)}
                className="mt-3 text-blue-600 text-sm underline"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <ResourceTable
              resources={resources}
              loading={loading}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

       
      </div>

      <ResourceForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSubmit={handleSave}
        initialData={currentResource}
      />
    </div>
  );
};

export default Ressources;