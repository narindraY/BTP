import React, { useState, useEffect } from 'react';

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
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow" style={{ borderRadius: "16px" }}>

          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">
              {initialData ? "Modifier la ressource" : "Ajouter une ressource"}
            </h5>
            <button type="button" className="btn-close" onClick={handleClose} />
          </div>

          <form onSubmit={onSubmit}>
            <div className="modal-body p-4">

              <div className="mb-3">
                <label className="form-label fw-semibold">Nom</label>
                <input
                  type="text"
                  name="nom_ressource"
                  value={formData.nom_ressource}
                  onChange={handleChange}
                  placeholder="Ex: Ciment, Ingénieur, Grue…"
                  required
                  className="form-control"
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold">Unité</label>
                  <input
                    type="text"
                    name="unite"
                    value={formData.unite}
                    onChange={handleChange}
                    placeholder="Sac, m², Tonne…"
                    className="form-control"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">Stock (quantité)</label>
                  <input
                    type="number"
                    name="quantite"
                    value={formData.quantite}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mb-1">
                <label className="form-label fw-semibold">Prix unitaire (FCFA)</label>
                <input
                  type="number"
                  name="prix_unitaire"
                  value={formData.prix_unitaire}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="modal-footer border-top">
              <button type="button" className="btn btn-light" onClick={handleClose}>Annuler</button>
              <button type="submit" className="btn btn-primary">
                {initialData ? "Enregistrer" : "+ Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;