import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiFolderPlus } from 'react-icons/fi';
import { base_url } from '../../Utils/IP';
import ProjectDetail from '../../Components/projets/ProjectDetail';
import ProjectCard from '../../Components/projets/ProjectCard';
import ProjectForm from '../../Components/projets/ProjectForm';

const Projets = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

    useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await axios.get(`${base_url}/projects`);

        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? res.data?.projects ?? [];

        setProjects(list);
        console.log("success", list);

      } catch (err) {
        console.log("error", err);
      }
    };

    loadProjects();
  }, []);

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold m-0" style={{ color: "#060b27" }}>Projets</h1>
          <p className="text-[13px] m-0 mt-0.5" style={{ color: "#9ca3af" }}>Suivi opérationnel des chantiers</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold rounded-lg text-white"
            style={{ background: "#0c7ac4" }}
          >
            <FiPlus size={14} />
            Nouveau projet
          </button>
        </div>
      </div>
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(12,122,196,0.08)" }}
          >
            <FiFolderPlus size={22} style={{ color: "#0c7ac4" }} />
          </div>
          <p className="text-[14px] m-0" style={{ color: "#9ca3af" }}>Aucun projet trouvé.</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg text-white"
            style={{ background: "#0c7ac4" }}
          >
            <FiPlus size={14} />
            Créer le premier projet
          </button>
        </div>

      ) : (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {projects.map(project => (
            <ProjectCard
              key={project.id_projet}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      )}
      <ProjectForm show={showForm} handleClose={() => setShowForm(false)} onProjectCreated={() => { setShowForm(false); fetchProjects(); }}/>
    </div>
  );
};

export default Projets;