import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard   from '../../components/projets/ProjectCard';
import ProjectDetail from '../../components/projets/ProjetDetail';
import ProjectForm   from '../../components/projets/ProjectForm';

const API = "http://localhost:5000/api";

const Projets = () => {
  const [projects, setProjects]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm]               = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}/projects`);
      const list = Array.isArray(res.data) ? res.data : res.data?.data ?? res.data?.projects ?? [];
      setProjects(list);
    } catch (err) {
      console.error("Erreur projets:", err);
      setError("Impossible de charger les projets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="container-fluid py-4">

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h4 fw-bold text-dark mb-0">Projets</h1>
          <p className="text-muted mb-0" style={{ fontSize: "13px" }}>Suivi opérationnel des chantiers</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-light border fw-semibold" onClick={fetchProjects}>
            ↺ Actualiser
          </button>
          <button className="btn btn-primary fw-semibold" onClick={() => setShowForm(true)}>
            + Nouveau projet
          </button>
        </div>
      </div>

      {loading ? (
        <div className="d-flex align-items-center justify-content-center py-5">
          <div className="spinner-border text-primary me-2" role="status" />
          <span className="text-muted">Chargement des projets…</span>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <p className="text-danger mb-3">{error}</p>
          <button className="btn btn-primary" onClick={fetchProjects}>Réessayer</button>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-5 text-muted" style={{ fontSize: "14px" }}>
          Aucun projet trouvé.{" "}
          <span className="text-primary fw-semibold" style={{ cursor: "pointer" }} onClick={() => setShowForm(true)}>
            Créer le premier projet →
          </span>
        </div>
      ) : (
        <div className="row g-3">
          {projects.map(project => (
            <div className="col-12 col-md-6 col-xl-4" key={project.id_projet}>
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </div>
          ))}
        </div>
      )}

      <ProjectForm
        show={showForm}
        handleClose={() => setShowForm(false)}
        onProjectCreated={() => { setShowForm(false); fetchProjects(); }}
      />
    </div>
  );
};

export default Projets;