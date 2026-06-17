import axios from "axios";
import { useEffect, useState } from "react";
import { base_url } from "../../Utils/IP";
import { FaWallet, FaChartLine, FaMoneyBillWave } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Budget() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Charger tous les projets au montage
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${base_url}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
        console.log("OK;",res.data)
      } catch (error) {
        console.log("Erreur chargement projets", error);
      }
    };
    fetchProjects();
  }, []);

  // Charger les finances quand un projet est sélectionné
  useEffect(() => {
    if (!selectedProject) return;

    const fetchFinance = async () => {
      setLoading(true);
      setData(null);
      try {
        const [budgetRes, spendRes, balanceRes] = await Promise.all([
          axios.get(`${base_url}/finance/budget`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { project_id: selectedProject },
          }),
          axios.get(`${base_url}/finance/spend`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { project_id: selectedProject },
          }),
          axios.get(`${base_url}/finance/balance`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { project_id: selectedProject },
          }),
        ]);

        setData({
          budget: budgetRes.data.length > 0 ? Number(budgetRes.data[0].budget) : 0,
          spend: spendRes.data.length > 0 ? Number(spendRes.data[0].spending) : 0,
          balance: balanceRes.data.length > 0 ? Number(balanceRes.data[0].reste_budget) : 0,
        });
      } catch (error) {
        console.log("Erreur chargement finance", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinance();
  }, [selectedProject]);

  const chartData = data && {
    labels: ["Finance"],
    datasets: [
      { label: "Budget", data: [data.budget], backgroundColor: "#22c55e" },
      { label: "Dépenses", data: [data.spend], backgroundColor: "#ef4444" },
      { label: "Balance", data: [data.balance], backgroundColor: "#3b82f6" },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#cbd5e1" } },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "##060b27",
        bodyColor: "#cbd5e1",
      },
    },
    scales: {
      x: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
      y: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
    },
  };

  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Finance</h1>

      {/* Sélecteur de projet */}
      <div className="mb-8">
        <label className="block text-sm text-slate-400 mb-2">
          Sélectionner un projet
        </label>
        <select
          className="bg-slate-800 text-white border border-slate-600 rounded-xl px-4 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedProject || ""}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="" disabled>-- Choisir un projet --</option>
          {projects.map((p,i) => (
            <option key={`${p.id_projet}-${i}`} value={p.id_projet}>
              {p.nom_projet}
            </option>
          ))}
        </select>
      </div>

      {/* État initial */}
      {!selectedProject && (
        <div className="text-slate-400 text-center mt-16">
          Sélectionnez un projet pour voir ses finances.
        </div>
      )}

      {/* Chargement */}
      {loading && (
        <div className="text-slate-400 text-center mt-16">Chargement...</div>
      )}

      {/* Données */}
      {data && !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-2xl hover:scale-105 transition duration-300">
              <div className="flex items-center gap-3">
                <FaWallet className="text-green-400 text-xl" />
                <h2 className="text-lg text-[var(--primary)] font-semibold">Budget</h2>
              </div>
              <p className="text-2xl mt-2 font-semibold text-green-300">{data.budget.toLocaleString()} Ar</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-2xl hover:scale-105 transition duration-300">
              <div className="flex items-center gap-3">
                <FaChartLine className="text-red-600 text-xl" />
                <h2 className="text-lg font-semibold text-[var(--primary)] ">Dépenses</h2>
              </div>
              <p className="text-2xl mt-2 font-semibold  text-red-600">{data.spend.toLocaleString()} Ar</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-lg hover:scale-105 transition duration-300">
              <div className="flex items-center gap-3">
                <FaMoneyBillWave className="text-[var(--primary)] text-xl" />
                <h2 className="text-lg font-semibold text-[var(--primary)] ">Balance</h2>
              </div>
              <p className="text-2xl mt-2 text-blue-700">{data.balance.toLocaleString()} Ar</p>
            </div>
          </div>

          <div className="bg-gray-400 p-4 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Évolution financière</h2>
            <div style={{ height: "230px" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Budget;