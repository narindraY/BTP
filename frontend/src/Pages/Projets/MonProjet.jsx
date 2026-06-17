import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiFolderPlus } from 'react-icons/fi';
import { base_url } from '../../Utils/IP';
import ProjectCard from '../../Components/projets/ProjectCard';
import ProjectDetail from '../../Components/projets/ProjectDetail';

const MonProjet = () => {
  const [projects, setProjects]         = useState([]);
  const [selectedProject, setSelected] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    const loadMyProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("token", token)
        const res = await axios.get(`${base_url}/my-projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? res.data?.projects ?? [];
          console.log("okey", res.data?.data)
          console.log("REPONSE COMPLETE:", res.data);
        setProjects(list);
      } catch (err) {
        console.error('Erreur chargement projets:', err);
        setError('Impossible de charger vos projets.');
        console.log("error", error)
      } finally {
        setLoading(false);
      }
    };

    loadMyProjects();
  }, []);

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-[20px] font-semibold m-0"
            style={{ color: '#060b27' }}
          >
            Mes Projets
          </h1>
          <p
            className="text-[13px] m-0 mt-0.5"
            style={{ color: '#9ca3af' }}
          >
            Suivi de vos chantiers en cours
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <span
            className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#0c7ac4', borderTopColor: 'transparent' }}
          />
        </div>
      )}

      {!loading && error && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-[13px]"
          style={{
            background: 'rgba(245,9,9,0.06)',
            color: '#f50909',
            border: '0.5px solid rgba(245,9,9,0.20)',
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(12,122,196,0.08)' }}
          >
            <FiFolderPlus size={22} style={{ color: '#0c7ac4' }} />
          </div>
          <p className="text-[14px] m-0" style={{ color: '#9ca3af' }}>
            Vous n'avez aucun projet pour le moment.
          </p>
          <p className="text-[12px] m-0" style={{ color: '#c4c8d0' }}>
            Contactez l'administration pour plus d'informations.
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id_projet}
              project={project}
              onClick={() => setSelected(project)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MonProjet;