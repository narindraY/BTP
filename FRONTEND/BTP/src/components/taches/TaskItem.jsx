import React from 'react';

const TaskItem = ({ task, onToggleStatus }) => {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Haute': return 'text-danger';
      case 'Moyenne': return 'text-warning';
      default: return 'text-info';
    }
  };

  return (
    <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <input 
          type="checkbox" 
          className="mr-3" 
          checked={task.statut === 'Terminé'} 
          onChange={() => onToggleStatus(task.id)}
        />
        <div>
          <h6 className={`mb-0 ${task.statut === 'Terminé' ? 'text-decoration-line-through text-muted' : ''}`}>
            {task.nom_tache}
          </h6>
          <small className="text-muted">Projet: {task.nom_projet} | Fin: {task.date_echeance}</small>
        </div>
      </div>
      <span className={`badge badge-pill border ${getPriorityStyle(task.priorite)}`}>
        {task.priorite}
      </span>
    </div>
  );
};

export default TaskItem;