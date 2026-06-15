import { useState, useEffect } from 'react';

const ResourceForm = ({ show, handleClose, handleSubmit, initialData, activeType }) => {
  const empty = {
    nom_ressource:  '',
    quantite:       '',
    prix_unitaire:  '',
    unite:          '',
    type_ressource: activeType || 'Matériau',
  };

  const [formData, setFormData] = useState(empty);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ ...empty, type_ressource: activeType || 'Matériau' });
    }
  }, [initialData, show, activeType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  if (!show) return null;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    >
      {/* Dialog */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h5 className="text-base font-bold text-gray-800">
            {initialData ? "Modifier la ressource" : "Ajouter une ressource"}
          </h5>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="px-6 py-5 flex flex-col gap-4">

            {/* Nom */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Nom</label>
              <input
                type="text"
                name="nom_ressource"
                value={formData.nom_ressource}
                onChange={handleChange}
                placeholder="Ex: Ciment, Ingénieur, Grue…"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Unité + Quantité */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Unité</label>
                <input
                  type="text"
                  name="unite"
                  value={formData.unite}
                  onChange={handleChange}
                  placeholder="Sac, m², Tonne…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Stock (quantité)</label>
                <input
                  type="number"
                  name="quantite"
                  value={formData.quantite}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Prix unitaire */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Prix unitaire (FCFA)</label>
              <input
                type="number"
                name="prix_unitaire"
                value={formData.prix_unitaire}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors"
            >
              {initialData ? "Enregistrer" : "+ Ajouter"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ResourceForm;