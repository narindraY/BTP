import React, { useState } from 'react';

const TaskForm = ({ show, handleClose, projects, onSubmit }) => {
  const [taskData, setTaskData] = useState({
    nom_tache: '',
    id_projet: '',
    priorite: 'Moyenne',
    date_echeance: ''
  });

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <h5 className="modal-title">Nouvelle Tâche</h5>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(taskData); handleClose(); }}>
            <div className="modal-body">
              <div className="form-group mb-3">
                <label>Nom de la tâche</label>
                <input type="text" className="form-control" onChange={e => setTaskData({...taskData, nom_tache: e.target.value})} required />
              </div>
              <div className="form-group mb-3">
                <label>Projet concerné</label>
                <select className="form-control" onChange={e => setTaskData({...taskData, id_projet: e.target.value})} required>
                  <option value="">-- Sélectionner --</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.nom_projet}</option>)}
                </select>
              </div>
              <div className="row">
                <div className="col-6">
                  <label>Priorité</label>
                  <select className="form-control" onChange={e => setTaskData({...taskData, priorite: e.target.value})}>
                    <option value="Basse">Basse</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Haute">Haute</option>
                  </select>
                </div>
                <div className="col-6">
                  <label>Échéance</label>
                  <input type="date" className="form-control" onChange={e => setTaskData({...taskData, date_echeance: e.target.value})} required />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Annuler</button>
              <button type="submit" className="btn btn-info">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;