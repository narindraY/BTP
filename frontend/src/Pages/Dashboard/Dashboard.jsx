import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiRefreshCw } from 'react-icons/fi';
import StatCards from '../../components/dashboard/StatCards';
import ProgressChart from '../../components/dashboard/ProgressChart';
import { base_url } from '../../Utils/IP';

const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt) ? d : dt.toLocaleDateString("fr-FR");
};

const StatusBadge = ({ status }) => {
  const styles = {
    "En cours": "bg-green-100 text-green-700",
    "Terminé": "bg-blue-100 text-blue-700",
    "En attente": "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] 
    font-semibold ${styles[status] ?? "bg-gray-100 text-gray-500"}`}>{status || "—"}</span>
  );
};

const MiniProgress = ({ value = 0 }) => {
  const pct = Math.min(Math.round(value || 0), 100);
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[13px] font-semibold text-gray-700">{pct}%</span>
    </div>
  );
};

const TABLE_HEADERS = ["Projet", "Type", "Budget alloué (FCFA)", "Début contrat", "Fin contrat", "Avancement", "Statut"];

const RecentProjects = ({ projects }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-100">
      <h2 className="text-[15px] font-bold text-gray-900">Projets récents</h2>
    </div>
    {projects.length === 0 ? (
      <p className="text-center text-gray-400 text-sm py-12">Aucun projet trouvé</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-[13.5px]">
          <thead>
            <tr className="bg-gray-50">
              {TABLE_HEADERS.map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {projects.map((p, i) => (
              <tr key={p.id_projet || i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{p.nom_projet}</td>
                <td className="px-4 py-3 text-gray-500">{p.type_projet}</td>
                <td className="px-4 py-3 text-gray-500 font-mono">{Number(p.budget_alloue || 0).toLocaleString("fr-FR")}</td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmtDate(p.contrat_debut)}</td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmtDate(p.contrat_fin)}</td>
                <td className="px-4 py-3"><MiniProgress value={p.avancement_moyen ?? 0} /></td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalContrats: 0, projetsActifs: 0, budgetTotal: 0, avancementMoyen: 0 });
  const [projets, setProjets] = useState([]);

  const fetchData = async () => {
    try {

      const [statsRes, projRes] = await Promise.all([
        axios.get(`${base_url}/stats`),
        axios.get(`${base_url}/projects`),
      ]);
      setStats(statsRes.data);
      const list = Array.isArray(projRes.data)
        ? projRes.data
        : projRes.data?.data ?? projRes.data?.projects ?? [];
      setProjets(list.slice(0, 5));
    } catch (err) {
      console.error("Erreur dashboard:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="flex flex-col gap-5 px-6 py-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
      </div>
      <StatCards stats={stats} />
      <ProgressChart projects={projets} />
      <RecentProjects projects={projets} />

    </div>
  );
};

export default Dashboard;